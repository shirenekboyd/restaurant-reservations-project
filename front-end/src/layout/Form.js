import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createReservation } from "../utils/api";
import ErrorAlert from "./ErrorAlert";
function Form() {
  const initialState = {
    "first_name": "",
    "last_name": "",
    "mobile_number": "",
    "reservation_date": "",
    "reservation_time": "",
    "people": 0,
  };
  const history = useHistory();
  const [error, setError] = useState(null);
  const [reservation, setReservation] = useState(initialState);
  function changeHandler({ target: { name, value } }) {
    setReservation((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }
  function submitHandler(e) {
    reservation.people = Number(reservation.people)
      e.preventDefault();
      let abortController = new AbortController();
      async function newReservation() {
        try {
          await createReservation(reservation, abortController.signal)
          let date = reservation.reservation_date
          setReservation(initialState)
          history.push(`/dashboard?date=${date}`)
        } catch (error) {
          setError(error);
        }
      }
      newReservation();
      return () => {
        abortController.abort();
      };
    }


  return (
    <div>
      <ErrorAlert error={error} />
      <h1>Create Reservation</h1>
      <form onSubmit={(e) => submitHandler(e)}>
        <div className="row">
          <div>
            <div className="col">
              <label htmlFor="first_name" className="form-label">
                First Name
              </label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                className="form-control"
                placeholder="First Name"
                aria-label="First Name"
                value={reservation.first_name}
                onChange={(e) => changeHandler(e)}
              />
            </div>
          </div>
          <div className="col">
            <label htmlFor="last_name" className="form-label">
              Last Name
            </label>
            <input
              type="text"
              name="last_name"
              className="form-control"
              placeholder="Last Name"
              aria-label="Last Name"
              value={reservation.last_name}
              onChange={(e) => changeHandler(e)}
            />
          </div>
          <div>
            <div className="col">
              <label htmlFor="mobile_number" className="form-label">
                Mobile Number
              </label>
              <input
                type="tel"
                id="phone"
                name="mobile_number"
                className="form-control"
                placeholder="Mobile Number"
                aria-label="Mobile Number"
                value={reservation.mobile_number}
                onChange={(e) => changeHandler(e)}
              />
            </div>
          </div>
        </div>

        <div className="row">
          <div>
            <div className="col">
              <label htmlFor="reservation_date" className="form-label">
                Date
              </label>
              <input
                type="date"
                id="reservation_date"
                name="reservation_date"
                className="form-control"
                placeholder="Date"
                aria-label="Date"
                value={reservation.reservation_date}
                onChange={(e) => changeHandler(e)}
              />
            </div>
          </div>
          <div>
            <div className="col">
              <label htmlFor="reservation_time" className="form-label">
                Time
              </label>
              <input
                type="time"
                id="reservation_time"
                name="reservation_time"
                className="form-control"
                placeholder="Time"
                aria-label="Time"
                value={reservation.reservation_time}
                onChange={(e) => changeHandler(e)}
              />
            </div>
          </div>
          <div>
            <div className="col">
              <label htmlFor="people" className="form-label">
                People
              </label>
              <input
                type="number"
                id="people"
                name="people"
                min="1"
                className="form-control"
                aria-label="People"
                value={reservation.people}
                onChange={(e) => changeHandler(e)}
              />
            </div>
          </div>
        </div>
        {/*Cancel button when clicked returns the user to the previous page */}
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
export default Form;