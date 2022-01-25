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

function update(reservation_id, status) {
  return knex(tableName)
  .select("*")
  .where({reservation_id})
  .update({status})
  .returning("*")
  .then(res => res[0])
}

//may need to add another update for updating a reservation???

function search(mobile_number){
  return knex("reservations")
  .whereRaw(
    "translate(mobile_number, '() -', '') like ?",
    `%${mobile_number.replace(/\D/g, "")}%`
  )
  .orderBy("reservation_date");
}



module.exports = {
   read,
    create,
    list,
    update,
    search,
  
  };
  