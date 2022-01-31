import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function CreateTables() {
  const initialState = {
    table_name: "",
    capacity: 0,
  };
  const history = useHistory();
  const [error, setError] = useState(null);
  const [table, setTable] = useState(initialState);

  function changeHandler({ target: { name, value } }) {
    setTable((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }
  function submitHandler(e) {
    table.capacity = Number(table.capacity);
    e.preventDefault();
    let abortController = new AbortController();
    async function newTable() {
      try {
        await createTable(table, abortController.signal);
        setTable(initialState);
        history.push(`/dashboard`);
      } catch (error) {
        setError(error);
      }
    }
    newTable();
    return () => {
      abortController.abort();
    };
  }

  return (
    <div>
      <ErrorAlert error={error} />
      <form className="form w-full max-w-lg" onSubmit={(e) => submitHandler(e)}>
        <h1>Create Table</h1>
        <p className="text-red-500 text-xs italic">
          Please fill out these fields.
        </p>
        <div className="flex flex-wrap mx-3 mb-6">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="table_name"
            >
              Table Name
            </label>
            <input
              name="table_name"
              className="form-control"
              id="table_name"
              type="text"
              value={table.table_name}
              placeholder="Table Name"
              aria-label="Table Name"
              onChange={(e) => changeHandler(e)}
              required
            />
          </div>
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="capacity"
            >
              Capacity
            </label>
            <input
              name="capacity"
              className="form-control"
              id="capacity"
              type="number"
              min="1"
              value={table.capacity}
              placeholder="1"
              onChange={(e) => changeHandler(e)}
              required
            />
          </div>
        </div>
        <button
          onClick={() => history.goBack()}
          type="button"
          className="btn btn-outline-danger m-2"
        >
          Cancel
        </button>

        <button
          className="btn btn-outline-success"
          type="submit"
          value="Submit"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
export default CreateTables;
