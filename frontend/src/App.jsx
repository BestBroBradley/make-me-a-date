import React, { useState, useEffect } from 'react';
import { useNylas } from '@nylas/nylas-react';
import CalendarApp from './CalendarApp';
import Yelp from './Yelp'
import NylasLogin from './NylasLogin';
import Layout from './components/Layout';

function App() {
  const nylas = useNylas();
  const [userId, setUserId] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [yelpResults, setYelpResults] = useState([]);
  const [haveResults, setHaveResults] = useState(false)
  const [primaryCalendar, setPrimaryCalendar] = useState(null)

  const serverBaseUrl =
    import.meta.env.VITE_SERVER_URI || 'http://localhost:9000';

  useEffect(() => {
    if (!nylas) {
      return;
    }

    // Handle the code that is passed in the query params from Nylas after a successful login
    const params = new URLSearchParams(window.location.search);
    if (params.has('code')) {
      nylas
        .exchangeCodeFromUrlForToken()
        .then((user) => {
          const { id } = JSON.parse(user);
          setUserId(id);
          sessionStorage.setItem('userId', id);
        })
        .catch((error) => {
          console.error('An error occurred parsing the response:', error);
        });
    }
  }, [nylas]);

  useEffect(() => {
    const userIdString = sessionStorage.getItem('userId');
    const userEmail = sessionStorage.getItem('userEmail');
    if (userIdString) {
      setUserId(userIdString);
    }
    if (userEmail) {
      setUserEmail(userEmail);
    }
    if (userIdString) {
      setUserId(userIdString);
    }
  }, []);

  useEffect(() => {
    if (userId?.length) {
      window.history.replaceState({}, '', `/?userId=${userId}`);
      getPrimaryCalendar();
    } else {
      window.history.replaceState({}, '', '/');
    }
  }, [userId]);

  const getPrimaryCalendar = async () => {
    try {
      const url = serverBaseUrl + '/nylas/read-calendars';

      const res = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: userId,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error(res.statusText);
      }

      const data = await res.json();

      let [calendar] = data.filter((calendar) => calendar.is_primary);
      // if no primary calendar, use the first one
      if (!calendar && data.length) {
        calendar = data[0];
      }

      setPrimaryCalendar(calendar);
      return calendar;
    } catch (err) {
      console.warn(`Error reading calendars:`, err);
    }
  };

  const disconnectUser = () => {
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('userEmail');
    setUserId('');
    setUserEmail('');
  };

  const toggleApp = () => {
    if (!userId) {
      return (<NylasLogin email={userEmail} setEmail={setUserEmail} />)
    } else if (!haveResults) {
      return (<div className="app-card">
        <Yelp
          serverBaseUrl={serverBaseUrl}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          haveResults={haveResults}
          setHaveResults={setHaveResults}
          yelpResults={yelpResults}
          setYelpResults={setYelpResults}
        />
      </div>)
    } else {
      return (<div className="app-card">
        <CalendarApp
          userId={userId}
          calendarId={primaryCalendar?.id}
          serverBaseUrl={serverBaseUrl}
          yelpResults={yelpResults}
          haveResults={haveResults}
          setHaveResults={setHaveResults}
          setYelpResults={setYelpResults}
        />
      </div>)
    }
  };


return (
  <Layout
    showMenu={!!userId}
    disconnectUser={disconnectUser}
    isLoading={isLoading}
  >
    {toggleApp()}
  </Layout>
);
}

export default App;
