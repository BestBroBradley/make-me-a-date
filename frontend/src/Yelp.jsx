import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Toast from './components/Toast';
import CreateYelpQuery from './CreateYelpQuery';
import './styles/calendar.scss';

function Yelp({
    serverBaseUrl,
    isLoading,
    setIsLoading,
    refresh,
    haveResults,
    setHaveResults,
    yelpResults,
    setYelpResults
}) {
    const [toastNotification, setToastNotification] = useState('');

    return (
        <>
            <Toast
                toastNotification={toastNotification}
                setToastNotification={setToastNotification}
            />
            
            <div className="calendar-app">
                <>
                    <div className="event-list-view">
                        <section className="event-header">
                            <p className="title">What kind of place are you looking for?</p>
                        </section>
                        <CreateYelpQuery
                            toastNotification={toastNotification}
                            setToastNotification={setToastNotification}
                            refresh={refresh}
                            serverBaseUrl={serverBaseUrl}
                            haveResults={haveResults}
                            setHaveResults={setHaveResults}
                            yelpResults={yelpResults}
                            setYelpResults={setYelpResults}
                        />
                    </div>
                </>
            </div>
            <div className="mobile-warning hidden-desktop">
                <h2>
                    Calendar sample app is currently designed for a desktop experience.
                </h2>
                <p>
                    Visit Nylas dashboard for more use-cases: https://dashboard.nylas.com
                </p>
            </div>
        </>
    );
}

Yelp.propTypes = {
    serverBaseUrl: PropTypes.string.isRequired,
    isLoading: PropTypes.bool.isRequired,
    setIsLoading: PropTypes.func.isRequired,
    refresh: PropTypes.func,
};

export default Yelp;