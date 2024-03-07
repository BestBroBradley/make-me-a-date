import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './styles/calendar.scss';
import ResultPreview from './ResultPreview';
import { initializeScrollShadow, handleScrollShadows } from './utils/calendar';

function YelpResults({ outings, selectedResult, isLoading, yelpResults, setYelpResults }) {
  const [showTopScrollShadow, setShowTopScrollShadow] = useState(false);
  const [showBottomScrollShadow, setShowBottomScrollShadow] = useState(false);

  useEffect(() => {
    initializeScrollShadow('.event-list-container', setShowBottomScrollShadow);
  }, [yelpResults, isLoading]);

  useEffect(() => {
    window.addEventListener('resize', () =>
      initializeScrollShadow('.event-list-container', setShowBottomScrollShadow)
    );
  }, []);

  const showRequiredNumberofResults = () => {

    const currentResults = yelpResults.slice(0, (outings / 4))

    return <>{currentResults.map((yelpResult) => (
      <div
        key={yelpResult.id}
      >
        <div className="event-barrier-top">
          <row />
        </div>
        <ResultPreview
          yelpResult={yelpResult}
          setYelpResults={setYelpResults}
          selectedResult={selectedResult}
          yelpResults={yelpResults}
        />
        <div className="event-barrier-bottom">
          <row />
        </div>
      </div>
    ))}</>
  }

  return (
    <section
      className="event-list-container scrollbar"
      onScroll={(event) =>
        handleScrollShadows(
          setShowTopScrollShadow,
          setShowBottomScrollShadow
        )
      }
    >
      <div
        className={`scroll-shadow top${showTopScrollShadow ? '' : ' hidden'}`}
      ></div>
      {yelpResults.length === 0 ? (
        <p className="loading-text">
          {isLoading
            ? 'Loading results.'
            : 'No results available.'}
        </p>
      ) : (
        <ul className="event-list">
          {showRequiredNumberofResults()}
        </ul>
      )}
      <div
        className={`scroll-shadow bottom${showBottomScrollShadow ? '' : ' hidden'
          }`}
      ></div>
    </section>
  );
}

export default YelpResults;
