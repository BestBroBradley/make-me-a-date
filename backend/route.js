const { default: Event } = require('nylas/lib/models/event');
const Nylas = require('nylas');
const axios = require('axios');
const dotenv = require('dotenv');

exports.callYelp = async (req, res) => {
  const location = req.query.location
  const term = req.query.term
  const radius = req.query.radius
  const outings = req.query.outings
  const url = `https://api.yelp.com/v3/businesses/search?location=${location}&term=${term}&radius=${radius}&best_match&limit=${outings}`
  const urlNoSpace = url.replace(/ /g,"%20")
  const urlNoComma = urlNoSpace.replace(/,/g,"%2c")

  const yelpKey = process.env.YELP_API_KEY

  const results = await axios({
    method: 'get',
    url: urlNoComma,
    headers: {
      'accept': 'application/json',
      'Authorization': `Bearer ${yelpKey}`
  }
  })
  .then((results) => {
    const businesses = results.data.businesses
    res.send(businesses)
  })
}

exports.readEvents = async (req, res) => {
  const user = res.locals.user;

  const { calendarId, startsAfter, endsBefore, limit } = req.query;

  const events = await Nylas.with(user.accessToken)
    .events.list({
      calendar_id: calendarId,
      starts_after: startsAfter,
      ends_before: endsBefore,
      limit: limit,
    })
    .then((events) => events);

  return res.json(events);
};

exports.readCalendars = async (req, res) => {
  const user = res.locals.user;

  const calendars = await Nylas.with(user.accessToken)
    .calendars.list()
    .then((calendars) => calendars);

  return res.json(calendars);
};

exports.createEvents = async (req, res) => {
  const user = res.locals.user;

  console.log(req.body.eventBody)

  const { location, calendarId, title, busy, visibility, description, when } =
    req.body.eventBody;

console.log()

  if (!calendarId || !title || !when) {
    return res.status(400).json({
      message:
        'Missing required fields: calendarId, title, starTime or endTime',
    });
  }

  const nylas = Nylas.with(user.accessToken);

  const event = new Event(nylas);

  event.calendarId = calendarId;
  event.title = title;
  event.location = location;
  event.description = description;
  event.when.startTime = when.startTime;
  event.when.endTime = when.endTime;
  event.busy = busy;
  event.visibility = visibility;

  // if (participants) {
  //   event.participants = participants
  //     .split(/\s*,\s*/)
  //     .map((email) => ({ email }));
  // }

  event.save();

  return res.json(event);
};
