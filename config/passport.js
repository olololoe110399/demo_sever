const LocalStrategy = require ('passport-local').Strategy;
const mongoose = require ('mongoose');
const bcrypt = require ('bcryptjs');

//load Admin Model
const Admin = require ('../models/admin');

module.exports = function (passport) {
  passport.use (
    new LocalStrategy ({adminField: 'email'}, (email, password, done) => {
      //Match admin
      Admin.findOne ({email: email})
        .then (admin => {
          if (!admin) {
            return done (null, false, {
              message: 'That email is not resgistered',
            });
          }
          //Match password
          bcrypt.compare (password, admin.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
              return done (null, admin);
            } else {
              return done (null, false, {message: 'Password is incorrect'});
            }
          });
        })
        .catch (err => console.log (err));
    })
  );

  passport.serializeUser ((admin, done) => {
    done (null, admin.id);
  });

  passport.deserializeUser ((id, done) => {
    Admin.findById (id, (err, admin) => {
      done (err, admin);
    });
  });
};
