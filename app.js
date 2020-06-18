const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose')
const session = require('express-session')
let MongoStore = require('connect-mongo')(session)
const flash = require('connect-flash')

const passport = require('passport')



const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

require('dotenv').config()
require('./lib/passport')

mongoose.connect(process.env.MONGODB_URI,{useNewUrlParser:true,useUnifiedTopology:true,useCreateIndex:true,}).then(()=>{
  console.log('Mongodb Connected')
}).catch((err)=>console.log(`Mongo err: ${err}`))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  resave:false,
  saveUninitialized: false,
  secret: process.env.SESSION_SECRET,
  store: new MongoStore({
      url: process.env.MONGODB_URI,
      mongooseConnection: mongoose.connection,
      autoReconnect: true,
  }),
  cookie:{
      secure: false,
      maxAge: 1000 * 60 * 60 * 24,
  }
}))

app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
app.use('/', indexRouter);
app.use('/', usersRouter);


app.use((req,res,next)=>{
  res.locals.user = req.user
  res.locals.errors =req.flash('errors')
  res.locals.success = req.flash('success')
  next()
})


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
