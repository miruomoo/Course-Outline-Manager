const User = require("./models/user");
const bcryptjs = require("bcryptjs");
const localStrategy = require("passport-local").Strategy;

module.exports = function(passport){
    passport.use(new localStrategy({usernameField: 'email', passwordField: 'password'}, (email, password, done) => {
            User.findOne({email: email}, (err, user) => {
                if(err) return done(err);
                if(!user) return done(null, false);
                bcryptjs.compare(password, user.password, (err, result) => {
                    if(err) throw err;
                    if (result === true) {
                        return done(null, user);
                    } else {
                        return done(null, false);
                    }
                });
            });
        })
    );
    passport.serializeUser((user,cb) => {
        cb(null, user.id);
    })
    passport.deserializeUser((id, cb) =>{
        User.findOne({_id: id}, (err, user) => {
            cb(err, user);
        });
    });
};