import React from "react";

function Tables({ onFinish, tables = [] }) {
  async function finishHandler({
    target: { dataset: { tableIdFinish, reservationIdFinish } } = {},
  }) {
    if (
      tableIdFinish &&
      reservationIdFinish &&
      window.confirm(
        "Is this table ready to seat new guests? This cannot be undone."
      )
    ) {
      await onFinish(tableIdFinish, reservationIdFinish);
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
            {table.reservation_id ? "Occupied" : "Free"}
          </td>
          <td>
            {" "}
            {table.reservation_id ? (
              <button
                type="button"
                className="btn btn-outline-dark"
                data-table-id-finish={table.table_id}
                data-reservation-id-finish={table.reservation_id}
                onClick={finishHandler}
              >
                Finish
              </button>
            ) : null}
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
            <th scope="col">Clear Table</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
  );
}

export default Tables;
