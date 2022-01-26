import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { updateTable, listTable } from "../utils/api";

function Seat() {
  const [error, setError] = useState(null);
  const [table, setTable] = useState([]);
  const { reservation_id } = useParams();
  //const [select, setSelect] = useState(); //come back to
  const [selectTable, setSelectTable] = useState({});
  const history = useHistory();

  function changeHandler({ target: { name, value } }) {
    setSelectTable((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  useEffect(loadTables, []);

  function submitHandler(e) {
    e.preventDefault();
    let abortController = new AbortController();
    async function assignTable() {
      try {
        console.log(selectTable);
        await updateTable(
          reservation_id,
          selectTable.table_id,
          abortController.signal
        );
        history.push(`/dashboard`);
      } catch (error) {
        setError(error);
      }
    }
    assignTable();
    return () => {
      abortController.abort();
    };
  }

  function loadTables() {
    const abortController = new AbortController();
    setError(null);
    listTable(abortController.signal).then(setTable).catch(setError);
    return () => abortController.abort();
  }

  const tableOptions = table.map((table) => {
    if (!table.reservation_id) {
      return (
        <option value={table.table_id} key={table.table_id}>
          {table.table_name} - {table.capacity}
        </option>
      );
    }
  });

  return (
    <div>
      <ErrorAlert error={error} />
      <h1>Seat Reservation</h1>
      <form onSubmit={(e) => submitHandler(e)}>
        <label htmlFor="tables">Assign Table:</label>
        <select name="table_id" onChange={changeHandler} required>
          <option value="">--Please select a table--</option>
          {tableOptions}
        </select>
        <button
          onClick={() => history.goBack()}
          type="button"
          className="btn btn-secondary m-2"
        >
          Cancel
        </button>
        {/*Submit button when clicked saves the new reservation, then displays the /dashboard page for the date of the new reservation */}
        <button className="btn btn-primary" type="submit" value="Submit">
          Submit
        </button>
      </form>
    </div>
  );
}

export default Seat;
