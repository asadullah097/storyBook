const path=require('path');

const express=require('express');

const mongoose = require('mongoose')

const dotenv=require('dotenv');

const methodOverride = require('method-override')

const passport=require('passport');

const session = require('express-session')

const MongoStore = require('connect-mongo')

const exphbs = require('express-handlebars');

const morgan=require('morgan');
//config
dotenv.config({ path:'./config/config.env'});
//passport
 require('./config/passport')(passport)
//connectDB
const connectDB=require('./config/db');

const app=express();

//body parser
app.use(express.urlencoded({extended:true}));
app.use(express.json());
// Method override
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      var method = req.body._method
      delete req.body._method
      return method
    }
  }))
connectDB();
//logging
if(process.env.NODE_ENV==='development'){
    app.use(morgan('dev'))
}
//Handlebar helper
const {
    formatDate,
    truncate,
    stripTags,
    editIcon,
    select,
}
=require('./helpers/helper');
//handlebar
app.engine('.hbs',exphbs({ helpers: {
    formatDate,truncate,stripTags,editIcon,select}, defaultLayout:'main',extname:'.hbs'}));

app.set('view engine', '.hbs');
//session
app.use(
    session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
      })
)
    
//passport middleware
app.use(passport.initialize());

app.use(passport.session());
//global
app.use(function(req,res,next){
  res.locals.user = req.user || null
  next()
});
//static folder
app.use(express.static(path.join(__dirname,'public')));

//Routes
app.use('/',require('./routes/index'));

app.use('/auth',require('./routes/auth'));

app.use('/stories',require('./routes/story'));

const port=process.env.PORT || 5000;

app.listen(port,()=>console.log(`the server is runing ${process.env.NODE_ENV} on port ${port}`));