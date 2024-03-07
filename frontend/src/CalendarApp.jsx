import React, { useState, preventDefault } from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import { getUnixTime } from 'date-fns'
import "react-datepicker/dist/react-datepicker.css";
import Toast from './components/Toast';
import './styles/calendar.scss';

function CalendarApp({
  userId,
  calendarId,
  serverBaseUrl,
  yelpResults,
  setYelpResults,
  haveResults,
  setHaveResults
}) {
  const [toastNotification, setToastNotification] = useState('');

  const intervalNumber = yelpResults.length

  const findUnixLeap = () => {
    switch (interval) {
      case "day":
        return 86400
      case "week":
        return 604800
      case "fortnight":
        return 1209600
      case "month":
        return 2419200
    }
  }

  const determineDates = () => {

    const firstTime = getUnixTime(startDate)
    const timeBetween = findUnixLeap()
    let timeArray = [firstTime]
    for (let i = 0; i < yelpResults.length - 1; i++) {
      let startTime = ((timeArray[timeArray.length - 1]) + timeBetween)
      timeArray.push(startTime)
    }
    return timeArray
  }

  const postEvent = async (eventBody) => {
    try {
      const url = serverBaseUrl + '/nylas/create-events';

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: userId,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventBody
        }),
      });

      if (!res.ok) {
        setToastNotification('error');
        throw new Error(res.statusText);
      }

      const data = await res.json();

      console.log('Event created:', data);
      setYelpResults([])
      setHaveResults(false)

    } catch (err) {
      console.log(`Error creating event:`, err);
    }
  }

  const generateEventBodies = (startTimes) => {

    const locationBuilder = (yelpResult) => {

      console.log("Got to location builder")
      let locationString = yelpResult.location.display_address[0]
      const address2 = yelpResult.location.display_address[1]
      const address3 = yelpResult.location.display_address[2]
      const address4 = yelpResult.location.display_address[3]

      if (address2) {
        locationString = locationString + ", " + address2
      }
      if (address3) {
        locationString = locationString + ", " + address3
      }
      if (address4) {
        locationString = locationString + ", " + address4
      }
      return locationString
    }

    let eventArray = []

    for (let i = 0; i < yelpResults.length; i++) {

      const locationString = locationBuilder(yelpResults[i])

      const event = {
        title: yelpResults[i].name,
        calendarId: calendarId,
        visibility: "private",
        busy: true,
        participants: [],
        description: `Make me a Date invites you to check out ${yelpResults[i].name}!<br/>It has a ${yelpResults[i].rating} star rating.`,
        when: {
          "startTime": startTimes[i],
          "endTime": (startTimes[i] + 3600)
        },
        location: locationString
      }
      eventArray.push(event)
    }
    return eventArray
  }

  const makeEvents = (event) => {
    event.preventDefault()
    const startTimes = determineDates()
    const eventBodies = generateEventBodies(startTimes)
    eventBodies.forEach(postEvent)
  }

  const [interval, setInterval] = useState("week");
  const [startDate, setStartDate] = useState(new Date());

  return (
  <>
      <Toast
        toastNotification={toastNotification}
        setToastNotification={setToastNotification}
      />
      <div className="calendar-app">
        <div className="event-list-view" >
          <div className="row">
            <section className="event-header">
              <p className="title">Ok, we'll set up {intervalNumber} events!</p>
            </section>
          </div>
          <div className="create-event-view" >
            <form id="event-form" className="scrollbar">
              <div className="row">
                <div className="field-container">
                  <label htmlFor="interval">I want to try a new place every... </label>
                  <select value={interval} onChange={(event) => {
                    setInterval(event.target.value);
                  }}>
                    <option value="day">day</option>
                    <option value="week">week</option>
                    <option value="fortnight">two weeks</option>
                    <option value="month">month</option>
                  </select>
                </div>
              </div>
              <div className="row">
                <div className="field-container">
                  <label htmlFor="start">Starting on... </label>
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    showTimeSelect
                    dateFormat="Pp" />
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="row">
          <div className="button-container">
            <button
              className="blue"
              type="submit"
              form="event-form"
              onClick={(event) => makeEvents(event)}
            >Make me some Outings!
            </button>
          </div>
        </div>
        </div>
  </>
      );
}

      CalendarApp.propTypes = {
        userId: PropTypes.string.isRequired,
      calendarId: PropTypes.string,
      serverBaseUrl: PropTypes.string.isRequired,
};

      export default CalendarApp;
