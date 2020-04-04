const express = require ('express');
const router = express.Router ();
const {ensureAuthenticated, forwardAuthenticated} = require ('../config/auth');
const controllerCustomer = require ('../controllers/customer');

// Welcome Page
router.get ('/', forwardAuthenticated, (req, res) => res.render ('welcome'));
router.get ('/dashboard', ensureAuthenticated, (req, res) => {
  res.render ('dashboard');
});
// Customer
router.get (
  '/customers',
  ensureAuthenticated,
  controllerCustomer.getCustomerByAdmin
);
router.get (
  '/customer-add',
  ensureAuthenticated,
  controllerCustomer.getCustomerCreatPage
);
router.post (
  '/customer-add',
  ensureAuthenticated,
  controllerCustomer.postCustomer
);
router.get ('/customer-delete-:id', controllerCustomer.getDeleteCustomer);
router.get ('/customer-edit-:id', controllerCustomer.getCustomerEditPage);
router.post ('/customer-edit-:id', controllerCustomer.postCustomerEdit);

router.get ('/products', ensureAuthenticated, (req, res) =>
  res.render ('products')
);
router.get ('/information', ensureAuthenticated, (req, res) =>
  res.render ('information')
);
router.get ('/maps', ensureAuthenticated, (req, res) => res.render ('maps'));
router.get ('/medias', ensureAuthenticated, (req, res) =>
  res.render ('medias')
);
router.get ('/profile', ensureAuthenticated, (req, res) =>
  res.render ('profile')
);

module.exports = router;
