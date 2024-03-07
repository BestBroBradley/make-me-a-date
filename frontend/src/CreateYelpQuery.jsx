import React, { useState } from 'react';
import PropTypes from 'prop-types';
import YelpResults from './YelpResults';

function CreateYelpQuery({
  serverBaseUrl,
  setToastNotification,
  refresh,
  isLoading,
  setIsLoading,
  haveResults,
  setHaveResults,
  yelpResults,
  setYelpResults,
}) {
  const [location, setLocation] = useState('');
  const [radius, setRadius] = useState("8046");
  const [term, setTerm] = useState('');
  const [outings, setOutings] = useState("1")

  const queryYelp = async (event) => {
    event.preventDefault()
    if (location) {
      try {
        const queryParams = new URLSearchParams({
          location,
          term,
          radius,
          outings
        });

        const url = `${serverBaseUrl}/yelp/get-results?${queryParams.toString()}`
        const res = await fetch(url, {
          method: 'GET',
          params: {
            location,
            term,
            radius,
            outings
          },
        });

        if (!res.ok) {
          throw new Error(res.statusText);
        }

        const data = (await res.json())

        setYelpResults(data);
      } catch (err) {
        console.warn(`Error calling Yelp:`, err);
      }
    }
  };

  const toggleHaveResults = () => {
    let finalResults = yelpResults.slice(0, (outings/4))
    setYelpResults(finalResults)
    setHaveResults(true)
  }

    return (
      <>
      <div className="create-event-view">
        <div>
        <form id="event-form" className="scrollbar" onSubmit={queryYelp}>
          <div className="row">
            <div className="field-container">
              <label htmlFor="outing-type">Outing Type (EX: coffee shop, restaurant, record store...)</label>
              <input
                type="text"
                name="outing-type"
                placeholder="I want to try..."
                onChange={(event) => {
                  setTerm(event.target.value);
                }}
                value={term}
              />
            </div>
          </div>
          <div className="row">
            <div className="field-container">
              <label htmlFor="event-start-time">Location</label>
              <input
                type="text"
                name="location"
                placeholder="I live in..."
                onChange={(event) => {
                  setLocation(event.target.value);
                }}
                value={location}
              />
            </div>
          </div>
          <div className="row">
            <div className="field-container">
              <label htmlFor="radius">Search Radius  - </label>
              <select value={radius} onChange={(event) => {
                setRadius(event.target.value);
              }}>
                <option value="8046">5 miles</option>
                <option value="16093">10 miles</option>
                <option value="32186">20 miles</option>
              </select>
            </div>
          </div>
          <div className="row">
            <div className="field-container">
              <label htmlFor="outings">How many places would you like to try?  - </label>
              <select value={outings} onChange={(event) => {
                setOutings(event.target.value);
              }}>
                <option value="4">1</option>
                <option value="8">2</option>
                <option value="12">3</option>
                <option value="16">4</option>
                <option value="20">5</option>
                <option value="24">6</option>
                <option value="28">7</option>
                <option value="32">8</option>
                <option value="36">9</option>
                <option value="40">10</option>
              </select>
            </div>
          </div>
        </form>
        </div>
        <section className="event-header">
          <p className="title">Let's take a look!</p>
          <div className="button-container">
            <button
              className="blue"
              type="submit"
              form="event-form"
              onClick={(event) => queryYelp(event)}
            >Search
            </button>
          </div>
        </section>
      </div>
      <YelpResults
            yelpResults={yelpResults}
            serverBaseUrl={serverBaseUrl}
            refresh={refresh}
            setYelpResults={setYelpResults}
            outings={outings}
          />
      {(yelpResults.length < 1) ? (<></>) : (<div className="button-container">
            <button
              className="blue"
              type="submit"
              form="event-form"
              onClick={(event) => toggleHaveResults()}
            >These results look good!
            </button>
          </div>)}
      </>
    );
  }

  CreateYelpQuery.propTypes = {
    toastNotification: PropTypes.string,
    setToastNotification: PropTypes.func,
    refresh: PropTypes.func,
  };
  export default CreateYelpQuery;
