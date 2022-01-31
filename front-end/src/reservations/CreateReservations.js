import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Form from "./Form";
import ErrorAlert from "../layout/ErrorAlert";
import { createReservation } from "../utils/api";

function CreateReservations() {
  const [error, setError] = useState("");
  const history = useHistory();

  async function submitHandler(reservation) {
    let abortController = new AbortController();
    try {
      await createReservation(reservation, abortController.signal);
      let date = reservation.reservation_date;
      history.push(`/dashboard?date=${date}`);
    } catch (error) {
      setError(error);
    }
    return () => {
      abortController.abort();
    };
  }

  return (
    <div>
      <ErrorAlert error={error} />
      <h1>Create a reservation</h1>
      <Form submitHandler={submitHandler} />
    </div>
  );
}

export default CreateReservations;
