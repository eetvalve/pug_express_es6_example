import express from 'express';
import bodyParser from 'body-parser';
import router from './routes/index';
import createError from 'http-errors';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import mongoose from 'mongoose';
import session from 'express-session';
import mongoConnect from 'connect-mongo';

let mongoStore = mongoConnect(session);
let app = express();

mongoose.connect("mongodb://akirves:kuli123>@ds241530.mlab.com:41530/logviewertestanddev");
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', router);

app.use((req, res, next) =>{
  next(createError(404));
});

app.use((err, req, res) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

app.use(session({
	  secret: 'work hard',
	  resave: true,
	  saveUninitialized: false,
	  store: new mongoStore({
		  mongooseConnection: db
	  })
	}));

app.use((req, res, next) =>{
	res.locals.currentUser = req.session.userId;
	next();
});

app.listen(3000, function () {
    console.log('app listening on port 3000!')
});