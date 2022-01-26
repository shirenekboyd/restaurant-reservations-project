const router = require("express").Router();
const controller = require("./reservations.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");
   
router
  .route("/")
  .post(controller.create)
  .get(controller.list)
  .all(methodNotAllowed);

  router
  .route("/:reservation_id")
  .put(controller.updateReservation)
  .get(controller.read)
  .all(methodNotAllowed);

  router
  .route("/:reservation_id/status")
  .put(controller.update)
  .all(methodNotAllowed);


module.exports = router;
