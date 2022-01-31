// import React, { useState, useEffect } from "react";
// import { useHistory, useParams } from "react-router-dom";
// import ErrorAlert from "../layout/ErrorAlert";
// import { updateTable, listTable } from "../utils/api";

// function Seat() {
//   const [error, setError] = useState(null);
//   const [table, setTable] = useState([]);
//   const { reservation_id } = useParams();
//   //const [select, setSelect] = useState(); //come back to
//   const [selectTable, setSelectTable] = useState({});
//   const history = useHistory();

//   function changeHandler({ target: { name, value } }) {
//     setSelectTable((prevState) => ({
//       ...prevState,
//       [name]: value,
//     }));
//   }

//   useEffect(loadTables, []);

//   function submitHandler(e) {
//     e.preventDefault();
//     let abortController = new AbortController();
//     async function assignTable() {
//       try {
//         console.log(selectTable);
//         await updateTable(
//           reservation_id,
//           selectTable.table_id,
//           abortController.signal
//         );
//         history.push(`/dashboard`);
//       } catch (error) {
//         setError(error);
//       }
//     }
//     assignTable();
//     return () => {
//       abortController.abort();
//     };
//   }

//   function loadTables() {
//     const abortController = new AbortController();
//     setError(null);
//     listTable(abortController.signal).then(setTable).catch(setError);
//     return () => abortController.abort();
//   }

//   const tableOptions = table.map((table) => {
//     // if (!table.reservation_id) {
//       return (
//         <option value={table.table_id} key={table.table_id}>
//           {table.table_name} - {table.capacity}
//         </option>
//       );
//     // }
//   });

//   return (
//     <div>
//       <ErrorAlert error={error} />
//       <h1>Seat Reservation</h1>
//       <form onSubmit={(e) => submitHandler(e)}>
//         <label htmlFor="tables">Assign Table:</label>
//         <select id="table_id" name="table_id" onChange={changeHandler} required>
//           <option value="">--Please select a table--</option>
//           {tableOptions}
//           {/* {tables.map((table) => (
//             <option key={table.table_id} value={table.table_id}>
//               {table.table_name} - {table.capacity}
//             </option>
//           ))} */}

//         </select>
//         <button
//           onClick={() => history.goBack()}
//           type="button"
//           className="btn btn-secondary m-2"
//         >
//           Cancel
//         </button>
//         {/*Submit button when clicked saves the new reservation, then displays the /dashboard page for the date of the new reservation */}
//         <button className="btn btn-primary" type="submit" value="Submit">
//           Submit
//         </button>
//       </form>
//     </div>
//   );
// }

// export default Seat;

import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { listTable, readReservation, seatReservation } from "../utils/api";

function Seat() {
  const history = useHistory();
  const { reservation_id } = useParams();

  const [reservation, setReservation] = useState({});
  const [tables, setTables] = useState([]);
  const [tableId, setTableId] = useState("");

  useEffect(() => {
    listTable().then(setTables);
  }, []);

  useEffect(() => {
      readReservation(reservation_id)
      .then(setReservation);
   }, [reservation_id]);

  function changeHandler({ target: { value } }) {
    setTableId(value);
  }

  function submitHandler(event) {
    event.preventDefault();
    event.stopPropagation();
    seatReservation(reservation.reservation_id, tableId)
      .then(() => history.push("/dashboard"));
  }

  return (
    <main>
      <h1>Seat</h1>
      <form onSubmit={submitHandler}>
        <fieldset>
          <div className="row">
            <div className="col">
              <select id="table_id" name="table_id" value={tableId} required={true} onChange={changeHandler}>
                <option value="">Table</option>
                {tables.map((table) => (
                  <option key={table.table_id} value={table.table_id}>
                    {table.table_name} - {table.capacity}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button type="button" className="btn btn-outline-danger m-2" onClick={() => history.goBack()}>Cancel</button>
          <button type="submit" className="btn btn-outline-success">Submit</button>
        </fieldset>
      </form>
    </main>
  );
}

export default Seat;
