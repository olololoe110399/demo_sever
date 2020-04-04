const express = require ('express');
const router = express.Router ();
const controller=require('../controllers/admin')



// Page
router.get ('/sign_in', controller.getSigninPage);
router.get ('/sign_up', controller.getSignupPage);

//Handle Sign up
router.post('/sign_up',controller.postSignup)
//Handle Sign in
router.post('/sign_in',controller.postSignin)
//Handle Log out
router.get ('/log_out', controller.getLogOut);
module.exports = router;
