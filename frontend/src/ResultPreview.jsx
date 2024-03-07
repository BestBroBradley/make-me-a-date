import React from 'react';
import { dividerBullet } from './utils/calendar';
import PropTypes from 'prop-types';
import YelpResults from './YelpResults';
// import { displayMeetingTime, getEventDate } from './utils/date';

function ResultPreview({ setYelpResults, yelpResults, yelpResult }) {

    const removeEvent = () => {
        const newResults = yelpResults.filter((result) => result.id !== yelpResult.id)
        setYelpResults(newResults)
    }

    return (
        <li>
            <div className="selected">
                <div className="details">
                    <div className="event-detail">
                        <span className="title truncate">{yelpResult.name}</span>
                    </div>
                    <div className="event-detail">

                        <span className="location truncate">
                            Address: {yelpResult.location.address1}
                        </span>
                    </div>
                    <div className="event-detail">
                        <p className="truncate">
                            Rating: {yelpResult.rating}
                        </p>
                    </div>
                    <button className="remove-result" onClick={() => removeEvent()}>
                        Remove this option
                    </button>
                </div>
            </div>
        </li>
    );
}

ResultPreview.propTypes = {
    yelpResult: PropTypes.object.isRequired,
    selectedResult: PropTypes.object,
};

export default ResultPreview;