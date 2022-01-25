var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const fileupload = require('express-fileupload');
// const flash = require('connect-flash');
// const session = require('express-session');
const mongoose = require('mongoose');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger/swagger.json')

const app = express();

const indexRouter = require('./routes/index');
const eventLocationRoutes = require('./routes/eventLocationRoutes');
const eventRoutes = require('./routes/eventRoutes');
const ticketsRoutes = require('./routes/ticketRoutes');
const clientRoutes = require('./routes/clientRoutes');
const adminRoutes = require('./routes/adminRoutes');

const { isPromoter, isClient } = require('./controllers/permissionsController');
const { token } = require('morgan');

//------------ Mongo Connection ------------//

mongoose.Promise = global.Promise;

const connectionsOptions = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	autoIndex: false,
	useFindAndModify: false,
};

const localMongoDB = 'mongodb://localhost:27017/paw_tp';

mongoose
	.connect(localMongoDB, connectionsOptions)
	.then(() => console.log(' CONNECTED TO DB!'))
	.catch(() => console.log(' error connecting to DB!'));

mongoose.set('useFindAndModify', false);
//------------ View Engine Setup ------------//
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//------------ Express Configuration ------------//
app.use(cors({}));
app.use(
	cors({
		credentials: true,
		origin: 'http://localhost:4200',
		allowedHeaders: ['*', 'x-access-token'],
		exposedHeaders: ['*', 'x-access-token'],
	})
);
app.use(fileupload());
// app.use(
// 	session({
// 		secret: 'secret',
// 		resave: true,
// 		saveUninitialized: true,
// 	})
// );
//------------ Passport Middlewares ------------//

//------------ Connecting flash ------------//
// app.use(flash());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Set variavel to erros
// app.use(function (req, res, next) {
// 	res.locals.success_msg = req.flash('success_msg');
// 	res.locals.error_msg = req.flash('error_msg');
// 	res.locals.error = req.flash('error');
// 	next();
// });

app.use('/', indexRouter);
app.use('/ticket', ticketsRoutes);
app.use('/eventLocation', isPromoter, eventLocationRoutes);
app.use('/event', eventRoutes);
app.use('/client', clientRoutes);
app.use('/admin', adminRoutes); //Colocar isAdmin!
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
