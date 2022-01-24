import React, { useState, useParams } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { updateTable } from "../utils/api";

function Seat({ tables }) {
  const [error, setError] = useState(null);
  const [table, setTable] = useState([]);
  const { reservationId } = useParams();
  const [select, setSelect] = useState(); //come back to
  const [selectTable, setSelectTable] = useState([]);
  const history = useHistory();

  function changeHandler({ target: { name, value } }) {
    setSelect((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }
  function submitHandler(e) {
    e.preventDefault();
    let abortController = new AbortController();
    async function assignTable() {
      try {
        await updateTable(reservationId, selectTable, abortController.signal);

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

  const tableOptions = tables.map((table) => {
    return (
      <option value={table.table_name} key={table.table_id}>
        {table.table_name} - {table.capacity}
      </option>
    );
  });

  return (
    <div>
      <ErrorAlert error={error} />
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
        <button className="btn btn-primary" type="submit" value="Submit">Submit</button>
      </form>
    </div>
  );
}

export default Seat;
