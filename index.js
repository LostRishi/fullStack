const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport')
const bodyParser = require('body-parser');
const keys = require('./config/keys');
require('./models/user');
require('./services/passport');
const authRoutes = require('./routes/authRoutes');

mongoose.connect(keys.mongoURI);

const app = express();

app.use(bodyParser.json());// this middleware will parse the body and then assign it to the req.body property of incoming request object

app.use(
    cookieSession({
        maxAge: 30 * 24 * 60 * 60 * 1000,
        keys: [keys.cookieKey]
    })
);

app.use(passport.initialize());
app.use(passport.session());

//require('./routes/authRoutes')(app);
authRoutes(app);
require('./routes/billingRoutes')(app);

if (process.env.NODE_ENV === 'production') {
    // express will show up production assets
    // like our main.js file or main.css file!
    app.use(express.static('client/build'));

    // Express will serve up index.html file if it doesnt recognize the route
    const path = require('path');
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT);  