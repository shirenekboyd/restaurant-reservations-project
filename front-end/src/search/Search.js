import React, { useState } from "react";
import { search, updateStatus } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { formatAsTime, formatAsDate } from "../utils/date-time";

function Search() {
  const [number, setNumber] = useState("");
  const [error, setError] = useState("");
  const [reservations, setReservations] = useState([]);

  function changeHandler({ target: { value } }) {
    setNumber(value);
  }

  function submitHandler(e) {
    e.preventDefault();
    const abortController = new AbortController();
    setError(null);
    setReservations([]);
    search(number, abortController.signal)
      .then((response) => {
        if (response.length) {
          return setReservations(response);
        } else {
          setError({ message: "No reservations found" });
        }
      })
      .catch(setError);
    return () => abortController.abort();
  }

  async function handleClick(reservation_id, status) {
    if (
      window.confirm(
        "Do you want to cancel this reservation? This cannot be undone."
      )
    ) {
      const abortController = new AbortController();
      await updateStatus(reservation_id, status, abortController.signal);
      //history.goBack();
      return () => abortController.abort();
    }
  }

  const reservationsTable = reservations.map((reservation) => {
    const { reservation_id } = reservation;
    return (
      <tr key={reservation.reservation_id}>
        <td scope="row">{reservation_id}</td>
        <td>{reservation.first_name}</td>
        <td>{reservation.last_name}</td>
        <td>{reservation.mobile_number}</td>
        <td>{formatAsDate(reservation.reservation_date)}</td>
        <td>{formatAsTime(reservation.reservation_time)}</td>
        <td>{reservation.people}</td>
        <td>{reservation.status}</td>
        <td>
          <a
            className="btn btn-outline-warning"
            href={`/reservations/${reservation.reservation_id}/edit`}
          >
            Edit
          </a>
          <button
            className="btn btn-primary"
            onClick={(e) =>
              handleClick(reservation.reservation_id, "cancelled")
            }
            type="button"
            className="btn btn-outline-danger"
            data-reservation-id-cancel={reservation.reservation_id}
          >
            Cancel
          </button>
        </td>
      </tr>
    );
  });

  return (
    <div>
      <h1>Search here</h1>
      <div className="row">
        <form onSubmit={submitHandler} className="col-4">
          <label htmlFor="mobile_number">Mobile number</label>
          <input
            name="mobile_number"
            type="text"
            id="mobile_number"
            className="form-control"
            value={number}
            required
            placeholder="Enter a phone number"
            onChange={changeHandler}
          />
          <button type="submit" className="btn btn-outline-primary m-2">
            Find
          </button>
        </form>
      </div>
      <ErrorAlert error={error} />
      {reservations.length > 0 ? (
        <table className="table">
          <thead className="thead-dark">
            <tr>
              <th scope="col">#</th>
              <th scope="col">First</th>
              <th scope="col">Last</th>
              <th scope="col">Mobile</th>
              <th scope="col">Date</th>
              <th scope="col">Time</th>
              <th scope="col">People</th>
              <th scope="col">Status</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>{reservationsTable}</tbody>
        </table>
      ) : null}
    </div>
  );
}

export default Search;
