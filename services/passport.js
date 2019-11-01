const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys')

const User = mongoose.model('users')

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    })
});

//googleStrategy can be said to be equal to the string 'google'(ie....authenticate to google === GoogleStrategy)
passport.use(new GoogleStrategy({
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: '/auth/google/callback',
    proxy: true
},
    async (accessToken, refreshToken, profile, done) => {
        // console.log('accessToken', accessToken);
        // console.log('refreshToken', refreshToken);
        // console.log('profile:', profile);
        const existingUser = await User.findOne({ googleId: profile.id })
        // .then((existingUser) => {
        if (existingUser) {
            //we already have a record with the given profileId
            done(null, existingUser);
        } else {
            // we dont have a user record with this id, make a new record
            const user = await new User({ googleId: profile.id }).save()
            // .then(user => done(null, user));
            done(null, user);
        }
    }
)
);

