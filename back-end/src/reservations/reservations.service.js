const knex = require("../db/connection");

const tableName = "reservations"


function create(newReservation) {
    return knex("reservations")
    .insert(newReservation, '*')
    .then((data) => data[0])
  }

  function list(date) {
    return knex("reservations")
    .select("*")
    .where({"reservation_date" : date})
    .orderBy("reservation_time")
  }



  function read(reservation_id) {
    return knex(tableName)
        .where("reservation_id", reservation_id)
        .first();
}






module.exports = {
   read,
    create,
    list,
  
  };
  