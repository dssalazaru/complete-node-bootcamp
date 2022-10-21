const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes.js');
const userRouter = require('./routes/userRoutes.js');

const app = express();

const api = '/api/v1'
const routes = {
  root: `${api}`,
  tours: `${api}/tours`,
  tours_id: `${api}/tours/:id`,
  users: `${api}/users`,
  users_id: `${api}/users/:id`,
}

// middlewares

app.use(morgan('dev'))
// app.use(morgan('tiny'))

app.use(express.json());

app.use((req, res, next) => {
  next();
})


app.use(routes.tours, tourRouter);
app.use(routes.users, userRouter);

module.exports = app;