const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const web = require('./routes/web');
const mongoose = require('mongoose');
const session = require("express-session");
const mongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");

const Student = require('./models/student');
const Admin = require('./models/admin');

const MONGODB_URI = 'mongodb+srv://pijush:12%40pIJUSH@cluster0.pylwp.mongodb.net/be';
const app = express();
const store = new mongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'  
});
const csrfProtection = csrf();


app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'my secret',
  resave: false,
  saveUninitialized: false,
  store: store
}));
app.use(csrfProtection);

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  if(req.session.admin){
    Admin.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
  }
  else{
    Student.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
  }
  
});
app.use(flash());

app.use('/', web);

mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);
mongoose
  .connect(
    MONGODB_URI,{ useNewUrlParser: true }
  )
  .then(result => {
    app.listen(4000);
  })
  .catch(err => {
    console.log(err);
  });











