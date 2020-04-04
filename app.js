const express = require ('express');
const fileUpload = require ('express-fileupload');
const path = require ('path');
const bodyParser = require ('body-parser');
const exphbs = require ('express-handlebars');
const mongose = require ('mongoose');
const flash = require ('connect-flash');
const session = require ('express-session');
const PORT = process.env.PORT || 5000;
const passport = require ('passport');

const app = express ();

//configure Passport
require ('./config/passport') (passport);

// configure Mongodb
const db = require ('./config/keys').mongoURI;

//connect to Mongo
mongose
  .connect (db, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then (() => {
    console.log ('MongoDB Connected... ');
  })
  .catch (err => console.log (err));

// configure fileupload
app.use (fileUpload ());

// configure body-parser
app.use (bodyParser.urlencoded ({extended: false}));
app.use (bodyParser.json ()); // parse form data client

//express sesstion
app.use (
  session ({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  })
);

//Passport midleware
app.use (passport.initialize ());
app.use (passport.session ());

//connect flash
app.use (flash ());

// Golbal Vars
app.use ((req, res, next) => {
  res.locals.success_msg = req.flash ('success_msg');
  res.locals.error_msg = req.flash ('success_msg');
  res.locals.error = req.flash ('error');
  next ();
});

// configure path static
const rootDir = path.dirname (process.mainModule.filename);
app.use (express.static (path.join (rootDir, 'public')));

// configure handlebar
app.engine ('.hbs', exphbs ());
app.set ('view engine', '.hbs');

// Routes
app.use ('/', require ('./routes/index.js'));
app.use ('/admin', require ('./routes/admins.js'));

app.listen (PORT, console.log (`Server started on port ${PORT}`));
