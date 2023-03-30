import passport from 'passport';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';

const jwtSecret = 'your_jwt_secret_key';

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtSecret
};

const jwtStrategy = new JWTStrategy(jwtOptions, (jwtPayload, done) => {
  if (jwtPayload.sub === 'user') {
    return done(null, true);
  } else {
    return done(null, false);
  }
});

passport.use(jwtStrategy);
