const Admin = require ('../models/admin');
const bcypt = require ('bcryptjs');
const passport = require ('passport');

exports.getSigninPage = (req, res) => {
  res.render ('sign_in');
};
exports.getSignupPage = (req, res) => {
  res.render ('sign_up');
};

// handle
exports.postSignup = async(req, res) => {
  const {full_name, password, password2, email} = req.body;
  let errors = [];
  if (password !== password2) {
    errors.push ({msg: 'Passwords do not math!!!'});
  }
  if (password.length < 8) {
    errors.push ({msg: 'Passwords should be at least 6 characters!!!'});
  }
  if (errors.length > 0) {
    res.render ('sign_up', {
      errors,
      full_name,
      email,
    });
  } else {
   await Admin.findOne ({email: email}).then (admin => {
      if (admin) {
        errors.push ({msg: 'E-mail is already exist'});
        res.render ('sign_up', {
          errors,
          full_name,
          email,
        });
      } else {
        //add Adminái
        const newAdmin = new Admin ({
          full_name,
          email,
          password,
        });
        bcypt.genSalt (10, (err, salt) =>
          bcypt.hash (newAdmin.password, salt, (err, hash) => {
            if (err) throw err;
            //set Password to hash
            newAdmin.password = hash;
            //saveUser
            newAdmin
              .save ()
              .then (admin => {
                console.log ('Save succesfull');
                req.flash (
                  'success_msg',
                  'You are now registered and can login'
                );
                res.redirect ('sign_in');
              })
              .catch (err => {
                console.log (err);
              });
          })
        );
      }
    });
  }
};
exports.postSignin = (req, res, next) => {
  passport.authenticate ('local', {
    successRedirect: '/dashboard',
    failureRedirect: 'sign_in',
    failureFlash: true,
  }) (req, res, next);
};
exports.getLogOut = async(req, res) => {
 await req.logout ();
 await req.flash ('success_msg', 'You are logged out');
 await res.redirect ('sign_in');
};
