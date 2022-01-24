const router = require("express").Router();
const controller = require("./tables.controller");
const reservationController = require("../reservations/reservations.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");
   

router.route("/")
  .post(controller.create)
  .get(controller.list).all(methodNotAllowed);


router.route("/:table_id/seat")
  .put(reservationController.reservationExists, controller.seat)
  .delete(controller.occupy).all(methodNotAllowed);
  
module.exports = router;
