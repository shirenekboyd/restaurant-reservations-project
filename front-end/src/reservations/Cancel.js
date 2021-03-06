import React, { useState } from "react";
//import { useHistory } from "react-router";
import { cancelReservation } from "../utils/api";

function Cancel({ reservation_id, loadDashboard }) {
  //const history = useHistory();

  async function handleClick(e) {
    if (
      window.confirm(
        "Do you want to cancel this reservation? This cannot be undone."
      )
    ) {
      const abortController = new AbortController();
      await cancelReservation(reservation_id, abortController.signal);
      //history.push("/");
      await loadDashboard();
      return () => abortController.abort();
    }
  }

  return (
    <button
      onClick={(e) => handleClick(e)}
      data-reservation-id-cancel={reservation_id}
      type="button"
      className="btn btn-outline-danger"
    >
      Cancel
    </button>
  );
}

export default Cancel;
