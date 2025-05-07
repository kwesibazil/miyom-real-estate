import 'dotenv/config'
import MongoStore from 'connect-mongo';
import {type CookieOptions } from 'express'
import session from 'express-session';

import {ConfigureError } from '../errors/errors.error'; 
import { mongoClientPromise } from './mongo-connection.config';


if (!process.env.STORE_SECRET) 
  throw new ConfigureError('session store env secret is missing.');

if (!process.env.SESSION_SECRET) 
  throw new ConfigureError('session secret env is missing.');


if (!process.env.DATABASE_NAME) 
  throw new ConfigureError('database name  env is missing.');


if (!process.env.MONGO_URL) 
  throw new ConfigureError('connection string missing name  env is missing.');



const sessionStore = MongoStore.create({
  crypto:{secret: process.env.STORE_SECRET},
  dbName: process.env.DATABASE_NAME,
  clientPromise: mongoClientPromise,
  collectionName: 'sessions', 
  touchAfter: 24 * 3600,                                  //👈 session is updated once in a period of 24 hours, with the exception of requests that changes something on the session data
  ttl: 12 * 60 * 60,                                      //👈 automatically remove from session collection if there's 12hrs of inactively 
})



const cookieOptions:CookieOptions = {
  httpOnly: true,
  sameSite: 'lax',                                         //👈 The browser will only send the cookie to the site/url that set the cookie
  maxAge: 1000 * 60 * 60  * 12,
  secure: process.env.NODE_ENV === 'production',         //👈in production change to true so that cookie will only be sent over HTTPS connections.
}




const sessionOptions: session.SessionOptions = {
  resave: false,
  store: sessionStore,
  cookie: cookieOptions,
  saveUninitialized: false,
  secret: process.env.SESSION_SECRET as string,
};



export default sessionOptions;