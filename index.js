require('dotenv').config();
const cors = require('cors');
const express = require('express');
const paginate = require('express-paginate');
const passport = require('passport');
const { connect } = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger_output.json');

const app = express();

const router = require('./routes/index');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());
require('./middleware/passport-middleware.js')(passport);

app.use(paginate.middleware(process.env.LIMIT, process.env.MAX_LIMIT));

app.use(router);

app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));

const startApp = async () => {
	try {
		await connect(process.env.MONGODB_URI);
		console.log(' Message>> ', `successfully connected to database`);
		app.listen(process.env.PORT, () =>
			console.log(`server is running on port ${process.env.PORT}`)
		);
	} catch (error) {
		console.log('Error :>> ', error.message);
		startApp();
	}
};

startApp();
