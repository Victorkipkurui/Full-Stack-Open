const cors = require('cors');
const mongoose = require('mongoose');
const express = require('express');
require('express-async-errors');
const loginRouter = require('./controllers/login')
const app = express();
const blogsRouter = require('./controllers/blogs');
const middleware = require('./utils/middlewares');
const config = require('./utils/config');
const logger = require('./utils/logger');
app.use(express.json());

mongoose.set('strictQuery', false);

logger.info('connecting to', config.MONGODB_URI);

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB');
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message);
  });

app.use('/api/blogs', blogsRouter);
app.use(cors());
app.use('/api/login', loginRouter)
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;