const express = require('express');
const exphbs  = require('express-handlebars');
const mongoose  = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session')
const passport = require('passport');
const { mongoURI } = require('./config/database');

//init express
const app = express();

//passport config
require('./config/passport')(passport)

//mongo connection
mongoose.Promise = global.Promise;
mongoose.connect(mongoURI, {
    useFindAndModify: true,
    useNewUrlParser: true
})
.then(() => console.log('MongoDb connected...'))
.catch( err => console.log(err));

//models
require('./models/Character')
const Character = mongoose.model('character')

//middlwares
app.use(express.static('public'))

app.engine('hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs'
}));
app.set('view engine', 'hbs');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(methodOverride('_method'))

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}))

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

//global vars
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    res.locals.user = req.user || null
    next()
});

//custom routes
app.get('/', (req, res) => res.render('index')); 
app.get('/about', (req, res) => res.render('about'));

//loude and use routes
const characters = require('./routes/characters');
const users = require('./routes/users');
app.use('/characters', characters)
app.use('/users', users)

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));