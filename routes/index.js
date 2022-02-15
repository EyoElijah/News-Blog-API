const router = require('express').Router();

const authRoute = require('./authRoute');
const adminRoute = require('./adminRoute');
const categorieRoute = require('./categoriesRoute');
const commentsRoute = require('./commentsRoute');
const profileRoute = require('./profileRoute');
const storiesRoute = require('./storiesRoute');
const videosRoute = require('./videosRoute');

router.use('/api/auth', authRoute);
router.use('/api/', adminRoute);
router.use('/api/', categorieRoute);
router.use('/api/', commentsRoute);
router.use('/api/', profileRoute);
router.use('/api/', storiesRoute);
router.use('/api/', videosRoute);

module.exports = router;
