const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

/**
 *
 * Helper Functions
 */
function asDateString(date) {
  return `${date.getFullYear().toString(10)}-${(date.getMonth() + 1)
    .toString(10)
    .padStart(2, "0")}-${date.getDate().toString(10).padStart(2, "0")}`;
}

function today() {
  return asDateString(new Date());
}
//console.log(today()) 2022-01-20

/**
 * List handler for reservation resources
 */

async function list(req, res) {
  let data = await service.list(req.query.date);
  data = data.filter((reservation) => reservation.status !== "finished")
  res.json({ data });
}

async function checkMobileNumber(req, res, next){
  const { mobile_number } = req.query;
  if (mobile_number){
    const data = await service.search(mobile_number);
    return res.status(200).json({data})
  }
  next();
}

async function create(req, res, next) {
  const data = await service.create(req.body.data);
  res.status(201).json({ data });
}

/**
 * V a l i d a t i o n
 */

function validationReservation(req, res, next) {
  const { data } = req.body;

  if (!data) {
    return next({ status: 400, message: "Data is missing" });
  }

  const requiredFields = [
    "first_name",
    "last_name",
    "mobile_number",
    "reservation_date",
    "reservation_time",
    "people",
  ];

  requiredFields.forEach((field) => {
    if (!data[field]) {
      return next({
        status: 400,
        message: `Reservation must include a ${field}`,
      });
    }
  });

  if(data.status === "seated" || data.status === "finished"){
    return next({
      status: 400,
      message: `Status cannot be ${data.status}`,
    });
}

  if (!Number.isInteger(data.people)) {
    return next({
      status: 400,
      message: "people must be a number",
    });
  }

  /**
   * D a t e   Validation
   */
  const dateFormat = /\d\d\d\d-\d\d-\d\d/;
  const timeFormat = /\d\d:\d\d/;
  if (!data.reservation_date.match(dateFormat)) {
    return next({
      status: 400,
      message: "reservation_date must be a date",
    });
  }
  if (!data.reservation_time.match(timeFormat)) {
    return next({
      status: 400,
      message: "reservation_time must be a time",
    });
  }
  /**
   * Tuesday and Past Date Check
   */
  let tuesdayCheck = new Date(data.reservation_date);
  tuesdayCheck = tuesdayCheck.getUTCDay();
  if (tuesdayCheck === 2) {
    return next({
      status: 400,
      message:
        "reservation_date cannot be Tuesday when the restaurant is closed",
    });
  }

  let now = new Date();
  let reservationDateTime = new Date(
    `${data.reservation_date}T${data.reservation_time}`
  );
  if (reservationDateTime < now) {
    return next({
      status: 400,
      message: "reservation_date must be in the future",
    });
  }
  /**
   * T I M E   Validation
   */

  if ("10:30" > data.reservation_time || data.reservation_time > "21:30") {
    return next({
      status: 400,
      message:
        "reservation_time cannot be before 10:30AM or after 9:30PM",
    });
  }

 

  return next();
}
function hasReservationId(req, res, next) {
  const reservation = req.params.reservation_id || req.body?.data?.reservation_id;

  if(reservation){
      res.locals.reservation_id = reservation;
      next();
  } else {
      next({
          status: 400,
          message: `missing reservation_id`,
      });
  }
}

async function reservationExists(req, res, next) {
  const reservation_id = res.locals.reservation_id;
  const reservation = await service.read(reservation_id);
  if (reservation) {
    res.locals.reservation = reservation;
    next();
  } else {
    next({status: 404, message: `Reservation not found: ${reservation_id}`});
  }
}

async function read(req, res,){
  const data = res.locals.reservation;
  res.status(200).json({
    data,
  })
}

async function update(req, res, next) {
  const {reservation_id} = req.params;
  const data = await service.update(reservation_id, req.body.data.status);
  res.status(200).json({data})
}

async function validateStatus(req, res, next){
  const status = req.body.data.status
  const {reservation_id} = req.params
  const checkReservation = await service.read(reservation_id)
  if (checkReservation.status === "finished"){
    next({ status: 400, message: `A finished reservation cannot be updated.` });
  }
 if (status !== "seated" && status !== "booked" && status !== "finished"){
    return next({ status: 400, message: `Invalid status: ${status}` });
  }
   next()
}

module.exports = {
  list: [asyncErrorBoundary(checkMobileNumber), asyncErrorBoundary(list)],
  create: [validationReservation, asyncErrorBoundary(create)],
  reservationExists: [hasReservationId, reservationExists],
  read: [hasReservationId, reservationExists, asyncErrorBoundary(read)],
  update: [hasReservationId, reservationExists, validateStatus, asyncErrorBoundary(update)]
};
