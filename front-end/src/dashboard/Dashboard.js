import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { listReservation, listTable, updateStatus } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import useQuery from "../utils/useQuery";
import Finish from "./Finish";
//import {formatTime} from "../utils/format-reservation-time";
//import formatAsDate from "../utils/format-reservation-date";
import {
  previous,
  next,
  today,
  formatAsTime,
  formatAsDate,
} from "../utils/date-time";

/* Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */

function Dashboard({ date }) {
  const query = useQuery();
  const getDate = query.get("date");

  if (getDate) {
    date = getDate;
  } else {
    date = today();
  }

  const [reservations, setReservations] = useState([]);
  // const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([]);
  const [errors, setErrors] = useState(null);

  useEffect(loadDashboard, [date]);
  useEffect(loadTables, []);

  function loadDashboard() {
    const abortController = new AbortController();
    setErrors(null);
    listReservation({ date }, abortController.signal)
      .then(setReservations)
      .catch(setErrors);
    return () => abortController.abort();
  }
  function loadTables() {
    const abortController = new AbortController();
    setErrors(null);
    listTable(abortController.signal).then(setTables).catch(setErrors);
    return () => abortController.abort();
  }

  const history = useHistory();

  function pushDate(dateToMove) {
    history.push(`/dashboard?date=${dateToMove}`);
  }

  function handleClick(nextOrPrev) {
    pushDate(nextOrPrev);
  }

  function statusChanger(reservation_id, status) {
    const abortController = new AbortController();
    updateStatus(reservation_id, status, abortController.signal).catch(
      setErrors
    );
    return () => abortController.abort();
  }

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
            >
              <button
                onClick={(e) =>
                  statusChanger(reservation.reservation_id, "seated")
                }
                type="button"
                class="btn btn-light"
              >
                Seat
              </button>
            </a>
          ) : null}
        </td>
      </tr>
    );
  });

  //include within the function below "Free" or "Occupied" depending on whether a reservation is seated at the table.
  const displayTables = tables.map((table, index) => {
    return (
      <tr key={index}>
        <th scope="row">{table.table_id}</th>
        <td>{table.table_name}</td>
        <td>{table.capacity}</td>
        <td data-table-id-status={table.table_id}>
          {table.reservation_id ? <Finish table_id={table.table_id} /> : "Free"}
        </td>
      </tr>
    );
  });

  return (
    <main className="min-h-screen m-12">
      <h1 className="p-10">Dashboard</h1>
      <div className="p-10 d-md-flex-row mb-3">
        <h4 className="mb-4">{`Reservations for ${date}`}</h4>
        <div>
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
            {reservationsTable}
          </table>
        </div>
        <div className="p-2">
          <table className="table">
            <thead className="thead-dark">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Table Name</th>
                <th scope="col">Capacity</th>
                <th scope="col">Free?</th>
              </tr>
            </thead>
            {displayTables}
          </table>
        </div>
        <div className="btn-group" role="group" aria-label="Basic example">
          <button
            onClick={() => handleClick(previous(date))}
            type="button"
            className="btn btn-dark"
          >
            Previous
          </button>
          <button
            onClick={() => history.push(`/dashboard`)}
            type="button"
            className="btn btn-dark"
          >
            Today
          </button>
          <button
            onClick={() => handleClick(next(date))}
            type="button"
            className="btn btn-dark"
          >
            Next
          </button>
        </div>
      </div>
      <ErrorAlert error={errors} />
      {JSON.stringify(reservations)}
    </main>
  );
}

export default Dashboard;
