const path=require('path');

const express=require('express');

const mongoose = require('mongoose')

const dotenv=require('dotenv');

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
connectDB();
//logging
if(process.env.NODE_ENV==='development'){
    app.use(morgan('dev'))
}
//Handlebar helper
const {formatDate,truncate,stripTags}=require('./helpers/helper');
//handlebar
app.engine('.hbs',exphbs({ helpers: {
    formatDate,truncate,stripTags}, defaultLayout:'main',extname:'.hbs'}));

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
//static folder
app.use(express.static(path.join(__dirname,'public')));

//Routes
app.use('/',require('./routes/index'));

app.use('/auth',require('./routes/auth'));

app.use('/stories',require('./routes/story'));

const port=process.env.PORT || 5000;

app.listen(port,()=>console.log(`the server is runing ${process.env.NODE_ENV} on port ${port}`));