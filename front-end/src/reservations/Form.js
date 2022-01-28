import React, { useState } from "react";
import { useHistory } from "react-router-dom";


function Form({submitHandler, initialState = {
  first_name: "",
  last_name: "",
  mobile_number: "",
  reservation_date: "",
  reservation_time: "12:00",
  people: 1,}}) { 

  const history = useHistory();

  const [reservation, setReservation] = useState(initialState);
  function changeHandler({ target: { name, value } }) {
    setReservation((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }
  
  function handleSubmit(e) {
    reservation.people = Number(reservation.people);
    e.preventDefault();
    submitHandler(reservation);
    
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
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
                onChange={changeHandler}
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
              onChange={changeHandler}
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
                onChange={changeHandler}
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
                onChange={changeHandler}
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
                onChange={changeHandler}
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
                onChange={changeHandler}
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
        <button className="btn btn-primary" type="submit" value="Submit">
          Submit
        </button>
      </form>
    </div>
  );
}
export default Form;
