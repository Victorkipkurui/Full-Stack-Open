const logger = require('./logger')
const jwt = require('jsonwebtoken')
const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    req.token = authorization.substring(7) // Attach token to request object
  } else {
    req.token = null
  }
  next()
}

const userExtractor = (req, res, next) => {
  if (req.token) {
    const decodedToken = jwt.verify(req.token, process.env.SECRET)
    if (!decodedToken.id) {
      return res.status(401).json({ error: 'Token invalid' })
    }
    req.user = decodedToken // Attach decoded token (user data) to request object
  } else {
    req.user = null
  }
  next()
}

const internalError = (req, res) => {
  res.status(500).send('Internal Server Error')
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    return response.status(400).json({ error: 'expected `username` to be unique' })
  } else if (error.name ===  'JsonWebTokenError') {
    return response.status(401).json({ error: 'token invalid' })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({
      error: 'token expired'
    })
  }
  next (error)
}
module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  internalError,
  userExtractor,
  tokenExtractor,
}