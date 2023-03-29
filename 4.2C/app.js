const express = require('express');
const winston = require('winston');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const app = express();
const secretKey = 'mySecretKey';

// generate token
function generateTokenID(req, res, next) {
  const user = { username: 'username', role: 'admin' };
  const token = jwt.sign(user, secretKey, { expiresIn: '1h' });
  req.token = token;
  next();
}



const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'calculator-microservice' },
  transports: [
    new winston.transports.Console({
      format: winston.format.simple()
    }),
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error'
    }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: secretKey
},
(jwtPayload, done) => {
  if (jwtPayload.role !== 'admin') {
    return done(null, false);
  }
  return done(null, jwtPayload);
}
));



app.get('/subtract', passport.authenticate('jwt', { session: false }), (req, res) => {
  const n1 = parseFloat(req.query.n1);
  const n2 = parseFloat(req.query.n2);

  if (isNaN(n1) || isNaN(n2)) {
    logger.error('Invalid');
    return res.status(400).json({ error: 'Invalid' });
  }

  const result = n1 - n2;

  logger.log({
    level: 'info',
    message: `New subtraction operation requested: ${n1} - ${n2} = ${result}`
  });

  res.json({ result });
});

app.get('/add', passport.authenticate('jwt', { session: false }), (req, res) => {
  const n1 = parseFloat(req.query.n1);
  const n2 = parseFloat(req.query.n2);

  if (isNaN(n1) || isNaN(n2)) {
    logger.error('Invalid');
    return res.status(400).json({ error: 'Invalid' });
  }

  const result = n1 + n2;

  logger.log({
    level: 'info',
    message: `New addition operation requested: ${n1} + ${n2} = ${result}`
  });

  res.json({ result });
});

app.get('/divide', passport.authenticate('jwt', { session: false }), (req, res) => {
  const n1 = parseFloat(req.query.n1);
  const n2 = parseFloat(req.query.n2);

  if (isNaN(n1) || isNaN(n2)) {
    logger.error('Invalid');
    return res.status(400).json({ error: 'Invalid' });
  }

  const result = n1 / n2;

  logger.log({
    level: 'info',
    message: `New divition operation requested: ${n1} / ${n2} = ${result}`
  });

  res.json({ result });
});

app.get('/multiply', passport.authenticate('jwt', { session: false }), (req, res) => {
  const n1 = parseFloat(req.query.n1);
  const n2 = parseFloat(req.query.n2);

  if (isNaN(n1) || isNaN(n2)) {
    logger.error('Invalid');
    return res.status(400).json({ error: 'Invalid' });
  }

  const result = n1 * n2;

  logger.log({
    level: 'info',
    message: `New multiplication operation requested: ${n1} * ${n2} = ${result}`
  });

  res.json({ result });
});

app.get('/generateTokenID', generateTokenID, (req, res) => {
  res.json({ token: req.token });
});

const port=3000;
app.listen(port,()=> {
    console.log("hello i'm listening to port " +port);
})