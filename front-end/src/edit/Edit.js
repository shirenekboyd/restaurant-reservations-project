import Form from "../layout/Form";
import ErrorAlert from "../layout/ErrorAlert";
import { useParams, useHistory } from "react-router-dom";
import { useEffect } from "react";
import React, { useState } from "react";
import { formatAsDate } from "../utils/date-time";
import { getReservation, updateReservation } from "../utils/api";

function Edit() {
  const [reservation_id] = useParams();
  const [reservation, setReservation] = useState(null);
  const [error, setError] = useState(null);
  const history = useHistory();

  useEffect(loadReservation, [reservation_id]);

  function loadReservation() {
    const abortController = new AbortController();
    setError(null);
    getReservation(reservation_id, abortController.signal)
      .then(setReservation)
      .catch(setError);
    return () => abortController.abort();
  }

  async function submitHandler(updatedReservation) {
    updatedReservation.mobile_number = updatedReservation.mobile_number.replace(
      /[^0-9.]/g,
      ""
    );
    updatedReservation.people = Number(updatedReservation.people);
    await updateReservation(updatedReservation)
      .then(() =>
        history.push(`/dashboard?date=${updatedReservation.reservation_date}`)
      )
      .catch(setError);
  }

  //may need to add this conditional
  //if(reservation) {
  //reservation.reservation_date = formatAsDate(reservation.reservation_date);
  //}

  return (
    <div>
      <h1>Edit reservation</h1>
      <ErrorAlert error={error} />
      {reservation && (
        <Form submitHandler={submitHandler} initialState={reservation} />
      )}
    </div>
  );
}
export default Edit;
