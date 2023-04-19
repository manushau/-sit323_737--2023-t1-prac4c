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
  const token = jwt.sign(user, secretKey, { expiresIn: '30s' });
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


const add= (n1,n2) => {
  return n1+n2;
}



app.get('/add', passport.authenticate('jwt', { session: false }), (req, res) => {
  try{
  const n1= parseFloat(req.query.n1);
  const n2=parseFloat(req.query.n2);
  if(isNaN(n1)) {
      logger.error("n1 is incorrectly defined");
      throw new Error("n1 incorrectly defined");
  }
  if(isNaN(n2)) {
      logger.error("n2 is incorrectly defined");
      throw new Error("n2 incorrectly defined");
  }
  
  if (n1 === NaN || n2 === NaN) {
      console.log()
      throw new Error("Parsing Error");
  }
  logger.info('Parameters '+n1+' and '+n2+' received for addition');
  const result = add(n1,n2);
  res.status(200).json({statuscocde:200, data: result }); 
  logger.log({
  level: 'info',
  message: `New addition operation requested: ${n1} + ${n2} = ${result}`
});
  } catch(error) { 
      console.error(error)
      res.status(500).json({statuscocde:500, msg: error.toString() })
    }
}); 




const subtract= (n1,n2) => {
  return n1-n2;
}



app.get('/subtract', passport.authenticate('jwt', { session: false }), (req, res) => {
  try{
  const n1= parseFloat(req.query.n1);
  const n2=parseFloat(req.query.n2);
  if(isNaN(n1)) {
      logger.error("n1 is incorrectly defined");
      throw new Error("n1 incorrectly defined");
  }
  if(isNaN(n2)) {
      logger.error("n2 is incorrectly defined");
      throw new Error("n2 incorrectly defined");
  }
  
  if (n1 === NaN || n2 === NaN) {
      console.log()
      throw new Error("Parsing Error");
  }
  logger.info('Parameters '+n1+' and '+n2+' received for addition');
  const result = subtract(n1,n2);
  res.status(200).json({statuscocde:200, data: result }); 
  logger.log({
  level: 'info',
  message: `New subtract operation requested: ${n1} - ${n2} = ${result}`
});
  } catch(error) { 
      console.error(error)
      res.status(500).json({statuscocde:500, msg: error.toString() })
    }
}); 


const divide= (n1,n2) => {
  return n1/n2;
}



app.get('/divide', passport.authenticate('jwt', { session: false }), (req, res) => {
  try{
  const n1= parseFloat(req.query.n1);
  const n2=parseFloat(req.query.n2);
  if(isNaN(n1)) {
      logger.error("n1 is incorrectly defined");
      throw new Error("n1 incorrectly defined");
  }
  if(isNaN(n2)) {
      logger.error("n2 is incorrectly defined");
      throw new Error("n2 incorrectly defined");
  }
  
  if (n1 === NaN || n2 === NaN) {
      console.log()
      throw new Error("Parsing Error");
  }
  logger.info('Parameters '+n1+' and '+n2+' received for divide');
  const result = divide(n1,n2);
  res.status(200).json({statuscocde:200, data: result }); 
  logger.log({
  level: 'info',
  message: `New divide operation requested: ${n1} / ${n2} = ${result}`
});
  } catch(error) { 
      console.error(error)
      res.status(500).json({statuscocde:500, msg: error.toString() })
    }
}); 


const multiply= (n1,n2) => {
  return n1*n2;
}



app.get('/multiply', passport.authenticate('jwt', { session: false }), (req, res) => {
  try{
  const n1= parseFloat(req.query.n1);
  const n2=parseFloat(req.query.n2);
  if(isNaN(n1)) {
      logger.error("n1 is incorrectly defined");
      throw new Error("n1 incorrectly defined");
  }
  if(isNaN(n2)) {
      logger.error("n2 is incorrectly defined");
      throw new Error("n2 incorrectly defined");
  }
  
  if (n1 === NaN || n2 === NaN) {
      console.log()
      throw new Error("Parsing Error");
  }
  logger.info('Parameters '+n1+' and '+n2+' received for multiply');
  const result = multiply(n1,n2);
  res.status(200).json({statuscocde:200, data: result }); 
  logger.log({
  level: 'info',
  message: `New multiply operation requested: ${n1} * ${n2} = ${result}`
});
  } catch(error) { 
      console.error(error)
      res.status(500).json({statuscocde:500, msg: error.toString() })
    }
}); 

app.get('/generateTokenID', generateTokenID, (req, res) => {
  res.json({ token: req.token });
});

const port=3000;
app.listen(port,()=> {
    console.log("hello i'm listening to port " +port);
})