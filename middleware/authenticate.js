var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var User = require('../models/user.model')
var jwt = require('jsonwebtoken'); 
// var config = require('../config/config');
var bcrypt = require('bcrypt')

exports.local = passport.use(new LocalStrategy( {usernameField:"email", passwordField:"password" },(email,password, done) => {
    User.findOne({where:{email:email}})
        .then(user => {
            if(!user){
                return done(null,false)
            }
            else{
                bcrypt.compare(password, user.password, function(err, result) {
                    if(err){
                        return done(err,false)
                    }
                    if(result){
                        return done(null,user.dataValues);
                    }
                    return done(null,false);
                });
            }
        })
        .catch(err => done(err,false))
}
));

exports.getToken = (user)  => {
    return jwt.sign(user, "1234567890098764321",
        {expiresIn: '1h'});
};

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = "1234567890098764321";

exports.jwtPassport = passport.use(new JwtStrategy(opts,
    (jwt_payload, done) => {
        console.log("JWT payload: ", jwt_payload);
        User.findOne({where:{id:jwt_payload.userID}, attributes: {exclude:'password'}})
        .then(user => {
            if(!user){
                done(null,false)
            }
            else if(user){
                user = user.hasOwnProperty('dataValues') ? user.dataValues : user
                return done(null,user);
            }
        })
        .catch(err => done(err,false))
    }));

exports.verifyUser = passport.authenticate('jwt', {session: false});
