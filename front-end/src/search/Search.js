import React, { useState } from "react";
import { search } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
//import Dashboard from "../dashboard/Dashboard";
//import add something here for displaying reservations
import { formatAsTime, formatAsDate } from "../utils/date-time";

function Search() {
  const [searchNumber, setSearchNumber] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [notFoundError, setNotFoundError] = useState(null);
  const [reservations, setReservations] = useState([]);

  function changeHandler({ target: { value } }) {
    setSearchNumber(value);
  }

  async function submitHandler(e) {
    const abortController = new AbortController();
    e.preventDefault();
    e.stopPropagation(); //not sure what this does
    setNotFoundError(null);
    const reservations = await search(searchNumber, abortController.signal);
    if (!reservations.length)
      setNotFoundError({ message: "No reservations found" });
    setSearchResults(reservations);
    return () => abortController.abort();
  }
  console.log(reservations);
  const reservationsTable = reservations.map((reservation) => {
    const { reservation_id } = reservation;
    return (
      <tr>
        <td scope="row">{reservation_id}</td>

        <td>{reservation.first_name}</td>
        <td>{reservation.last_name}</td>
        <td>{reservation.mobile_number}</td>

        <td>{formatAsDate(reservation.reservation_date)}</td>
        <td>{formatAsTime(reservation.reservation_time)}</td>

        <td>{reservation.people}</td>

        <td>{reservation.status}</td>
        <td>
          {reservation.status === "booked" ? (
            <a
              className="btn btn-primary"
              href={`/reservations/${reservation.reservation_id}/seat`}
            ></a>
          ) : null}
        </td>
      </tr>
    );
  });

  //console.log(reservations);
  return (
    <div>
      <h1>Search here</h1>
      <div className="row">
        <form onSubmit={submitHandler} className="col-4">
          <label htmlFor="mobil_number">Mobile number</label>
          <input
            name="mobile_number"
            type="text"
            id="mobile_number"
            className="form-control"
            value={searchNumber}
            required
            placeholder="Enter a phone number"
            onChange={changeHandler}
          />
          <button type="sumbit" className="btn btn-primary">
            Find
          </button>
        </form>
      </div>
      <ErrorAlert error={notFoundError} />
      {reservations.length > 0 ? (
        <table className="table">
          {reservationsTable}
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
        </table>
      ) : null}
    </div>
  );
}

export default Search;
