import 'dotenv/config'
import path from 'path';

import express from 'express'
import cors from 'cors';
import helmet from 'helmet';
import passport from 'passport';
import flash from 'connect-flash';
import session from 'express-session';
import rateLimit from 'express-rate-limit';

import routes from './routes/index.routes'
import corsOptions from './configs/cors.config';
import passportLocal from './configs/passport-local.config';
import { GlobalCustomErrorHandler, RouteNotFoundErrorHandler } from './errors/GlobalErrorHandler'
import sessionOptions from './configs/session.config';

const server = express();
const PORT = process.env.PORT || 3000;


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes.',
});


//global middleware
server.use(helmet());                                             //👈 helmet http headers
server.use(express.json());                                       //👈 json parser
server.use(cors(corsOptions));                                    //👈 cors
server.use(session(sessionOptions));
server.use(express.urlencoded({extended: true}));                 //👈 URL-encoded parser



// passport middleware
server.use(flash());
passport.use(passportLocal);                                      //👈 passport local strategy  - authentication and authorization 
server.use(passport.initialize());                                //👈 on each request, checks if req.session.passport.user object exist and initialize it
server.use(passport.session());                                   //👈 uses the user property found on req.session.passport.user to re-initialize user via the passport.deserializeUser() 

server.use(express.static(path.join(__dirname, '../../client/dist')));
server.use(limiter);


server.use(routes);

server.get(/.*/, (req, res) => { 
  res.sendFile(path.join(__dirname, '../../client/dist/', 'index.html'));
});



server.use(RouteNotFoundErrorHandler);                            //👈 route not found handler
server.use(GlobalCustomErrorHandler);                             //👈 global error handler

server.listen(PORT, () => {
  console.log(`\nServer listening at http:// localhost:${PORT}`);
});
