const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');

const app = express();

// Passport Config
require('./config/passport')(passport);

// DB Config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true ,useUnifiedTopology: true}
  )
  .then(() => console.log('MongoDB Connected - Website'))
  .catch(err => console.log(err));

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.use('/public', express.static('public'))
app.set('views', `${__dirname + '/views'}`)

// Express body parser
app.use(express.urlencoded({ extended: true }));

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Routes
app.use('/', require('./routes/index.js'));
app.use('/users', require('./routes/users.js'));
app.use('/dashboard', require('./routes/dashboard.js'));
app.use('/verify', require('./routes/verify.js'));
app.use('/recovery', require('./routes/recovery.js'));
app.use( (req, res, next)=>{ res.status('404').render('404') })

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on  ${PORT}`));


//================================================================================
// Whatsapp Bot
//================================================================================

const { spawn } = require(`child_process`);
const child = spawn('node', ['./bot/index.js'], {shell: true});

child.stdout.on('data', (data) => {
  console.log(`${data}`);
});
  
child.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});
  
child.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
