import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { listReservation, listTable, finishTable, updateStatus } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import useQuery from "../utils/useQuery";
import Finish from "./Finish";
import Cancel from "../reservations/Cancel"

import Tables from "./Tables";

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
  const [tables, setTables] = useState(null);
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

  function statusChanger(reservation_id, status) { //may need async here
    const abortController = new AbortController();
    updateStatus(reservation_id, status, abortController.signal).catch( //may need await here
      setErrors
    );
    return () => abortController.abort();
  }

  function onFinish(table_id, reservation_id) {
    finishTable(table_id, reservation_id)
      .then(loadDashboard)
      .then(loadTables)
  }
// let filteredReservations = reservations.filter((reservation) => {
//   return reservation.status !== "finished" && reservation.status
// !== "cancelled"})

  const reservationsTable = reservations.map((reservation) => {
    const { reservation_id } = reservation;
    return (
      <tr key={reservation_id}>
        <td scope="row">{reservation_id}</td>
        <td>{reservation.first_name}</td>
        <td>{reservation.last_name}</td>
        <td>{reservation.mobile_number}</td>
        <td>{formatAsDate(reservation.reservation_date)}</td>
        <td>{formatAsTime(reservation.reservation_time)}</td>
        <td>{reservation.people}</td>
        <td data-reservation-id-status={reservation.reservation_id}>{reservation.status}</td>
        <td>
          {reservation.status === "booked" ? (
            <div>
              <button
                // onClick={(e) =>
                //   statusChanger(reservation.reservation_id, "seated")
                // }
                type="button"
                className="btn btn-outline-success m-2"
              >
                <a
                  //className="btn btn-outline-success"
                  href={`/reservations/${reservation.reservation_id}/seat`}
                >
                  Seat
                </a>
              </button>

              <a
                className="btn btn-outline-warning m-2"
                href={`/reservations/${reservation.reservation_id}/edit`}
              >
                Edit
              </a>
              <Cancel reservation_id={reservation.reservation_id}/>
            </div>
          ) : null}
        </td>
      </tr>
    );
  });

  //include within the function below "Free" or "Occupied" depending on whether a reservation is seated at the table.
  // const displayTables = tables.map((table) => {
  //   return (
  //     <tr key={table.table_id}>
  //       <th scope="row">{table.table_id}</th>
  //       <td>{table.table_name}</td>
  //       <td>{table.capacity}</td>
  //       <td data-table-id-status={table.table_id}>
  //         {table.reservation_id ? <Finish table_id={table.table_id} /> : "Free"}
  //       </td>
  //     </tr>
  //   );
  // });

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
            <tbody>{reservationsTable}</tbody>
          </table>
        </div>
        {/* <div className="p-2">
          <table className="table">
            <thead className="thead-dark">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Table Name</th>
                <th scope="col">Capacity</th>
                <th scope="col">Free?</th>
              </tr>
            </thead>
            <tbody>{displayTables}</tbody>
          </table>
        </div> */}

        <div>
          {tables && <Tables onFinish={onFinish} tables={tables} />}
        </div>

        <div className="btn-group" role="group" aria-label="Basic example">
          <button
            onClick={() => handleClick(previous(date))}
            type="button"
            className="btn btn-outline-info"
          >
            Previous
          </button>
          <button
            onClick={() => history.push(`/dashboard`)}
            type="button"
            className="btn btn-outline-info"
          >
            Today
          </button>
          <button
            onClick={() => handleClick(next(date))}
            type="button"
            className="btn btn-outline-info"
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

// import React, { useEffect, useState } from "react";
// import { listReservation, listTable, finishTable, cancelReservation } from "../utils/api";
// import ErrorAlert from "../layout/ErrorAlert";
// import Reservations from "./Reservations";
// import Tables from "./Tables";

// function Dashboard({ date }) {
//   const [reservations, setReservations] = useState([]);
//   const [reservationsError, setReservationsError] = useState(null);
//   const [tables, setTables] = useState([]);

//   useEffect(loadDashboard, [date]);

//   function loadDashboard() {
//     const abortController = new AbortController();
//     setReservationsError(null);
//     listReservation({ date }, abortController.signal)
//       .then(setReservations)
//       .catch(setReservationsError);

//     listTable().then(setTables)
//     return () => abortController.abort();
//   }

//   function onCancel(reservation_id) {
//     cancelReservation(reservation_id)
//       .then(loadDashboard)
//       .catch(setReservationsError);
//   }

//   function onFinish(table_id, reservation_id) {
//     finishTable(table_id, reservation_id)
//       .then(loadDashboard)
//   }

//   return (
//     <main>
//       <h1>Dashboard</h1>
//       <div className="d-md-flex mb-3">
//         <h4 className="mb-0">Reservations</h4>
//       </div>
//       <ErrorAlert error={reservationsError} />
//       <Reservations reservations={reservations} onCancel={onCancel} />
//       <div className="d-md-flex mb-3">
//         <h4 className="mb-0">Tables</h4>
//       </div>
//       <Tables onFinish={onFinish} tables={tables} />
//     </main>
//   );
// }

// export default Dashboard;