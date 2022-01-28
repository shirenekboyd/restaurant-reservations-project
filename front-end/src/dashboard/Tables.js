import React from "react";
import { useHistory } from "react-router-dom";
// import { deleteTable } from "../utils/api";

function Tables({ onFinish, tables = [] }) {
  const history = useHistory();
  function finishHandler({
    target: { dataset: { tableIdFinish, reservationIdFinish } } = {},
  }) {
    if (
      tableIdFinish &&
      reservationIdFinish &&
      window.confirm(
        "Is this table ready to seat new guests? This cannot be undone."
      )
    ) {
      //finishTable(tableIdFinish, reservationIdFinish);
      onFinish(tableIdFinish, reservationIdFinish);
      // deleteTable(table_id)
      history.push("/");
    }
  }

  const rows = tables.length ? (
    tables.map((table) => {
      return (
        <tr key={table.table_id}>
          <th scope="row">{table.table_id}</th>
          <td>{table.table_name}</td>
          <td>{table.capacity}</td>
          <td data-table-id-status={table.table_id}>
            {table.reservation_id === "Occupied" ? (
              //  ("Occupied")
              <button
                type="button"
                className="btn btn-outline-info"
                data-table-id-finish={table.table_id}
                data-reservation-id-finish={table.reservation_id}
                onClick={finishHandler}
              >
                Finish
              </button>
            ) : (
              "Free"
            )}
            {/* {table.reservation_id ? <Finish table_id={table.table_id} /> : "Free"} */}
          </td>
        </tr>
      );
    })
  ) : (
    <div>No results</div>
  );
  return (
    <div>
      <table className="table">
        <thead className="thead-dark">
          <tr>
            <th scope="col">#</th>
            <th scope="col">Table Name</th>
            <th scope="col">Capacity</th>
            <th scope="col">Free?</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
  );
}

export default Tables;
