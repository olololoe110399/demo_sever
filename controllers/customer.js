const {v4: uuidv4} = require ('uuid');
const Customer = require ('../models/customer');
const bcypt = require ('bcryptjs');
var fs = require ('fs');

exports.getCustomerByAdmin = (req, res, next) => {
  Customer.find ({}).then (customers => {
    res.render ('customers', {
      customers: customers.map (customers => customers.toJSON ()),
    });
  });
};

exports.getCustomerCreatPage = (req, res, next) => {
  res.render ('add_customer');
};
exports.postCustomer = async (req, res, next) => {
  let errors = [];
  const {
    full_name,
    password,
    password2,
    username,
    date,
    address,
    phone,
  } = req.body;
  let uploadedFile = req.files.image;
  let fileExtension = uploadedFile.mimetype.split ('/')[1];
  let image_path = uuidv4 () + '.' + fileExtension;
  if (password !== password2) {
    errors.push ({msg: 'Passwords do not math!!!'});
  }
  if (password.length < 8) {
    errors.push ({msg: 'Passwords should be at least 6 characters!!!'});
  }
  if (errors.length > 0) {
    res.render ('add_customer', {
      errors,
      full_name,
      username,
      date,
      address,
      phone,
    });
  } else {
    await Customer.findOne ({username: username}).then (customer => {
      if (customer) {
        errors.push ({msg: 'E-mail is already exist'});
        res.render ('add_customer', {
          errors,
          full_name,
          username,
          date,
          address,
          phone,
        });
      } else {
        if (
          uploadedFile.mimetype === 'image/png' ||
          uploadedFile.mimetype === 'image/jpeg' ||
          uploadedFile.mimetype === 'image/gif'
        ) {
          uploadedFile.mv (`public/img/${image_path}`, err => {
            if (err) throw err;
            //add Adminái
            const newCustomer = new Customer ({
              full_name,
              username,
              date,
              address,
              phone,
              image_path,
              password,
            });
            bcypt.genSalt (10, (err, salt) =>
              bcypt.hash (newCustomer.password, salt, (err, hash) => {
                if (err) throw err;
                //set Password to hash
                newCustomer.password = hash;
                //saveUser
                newCustomer
                  .save ()
                  .then (customer => {
                    console.log ('Save succesfull');
                    req.flash (
                      'success_msg',
                      'You are create customer success!'
                    );
                    res.redirect ('customers');
                  })
                  .catch (err => {
                    console.log (err);
                  });
              })
            );
          });
        } else {
          errors.push ({
            msg: "Invalid File format. Only 'gif', 'jpeg' and 'png' images are allowed.",
          });
          res.render ('add_customer', {
            errors,
            full_name,
            username,
            date,
            address,
            phone,
          });
        }
      }
    });
  }
};
exports.getDeleteCustomer = (req, res) => {
  let id = req.params.id;
  Customer.findOne ({_id: id})
    .then (customer => {
      if (customer) {
        let image_path = customer.toJSON ().image_path;
        fs.unlink (`public/img/${image_path}`, err => {
          if (err) throw err;
          Customer.deleteOne ({_id: id})
            .then (() => {
              req.flash ('success_msg', 'Delete customer succsess!');
              res.redirect ('customers');
            })
            .catch (err => {
              console.log (err);
            });
        });
      }
    })
    .catch (err => {
      console.log (err);
    });
};
exports.getCustomerEditPage = (req, res) => {
  let id = req.params.id;
  Customer.findById ({_id: id}, (err, customer) => {
    if (err) throw err;
    res.render ('edit_customer', {
      customer: customer.toJSON (),
    });
  });
};
exports.postCustomerEdit = (req, res) => {
  let id = req.params.id;
  const {full_name, date, address, phone} = req.body;

  const {} = req.body;
  if (req.files) {
    let uploadedFile = req.files.image;
    let fileExtension = uploadedFile.mimetype.split ('/')[1];
    let image_name = id + '.' + fileExtension;
    if (
      uploadedFile.mimetype === 'image/png' ||
      uploadedFile.mimetype === 'image/jpeg' ||
      uploadedFile.mimetype === 'image/gif'
    ) {
      fs.unlink (`public/img/${image_name}`, function (err) {
        if (err) throw err;
        uploadedFile.mv (`public/img/${image_name}`, err => {
          if (err) throw err;
          Customer.findById (id).then (customer => {
            if (!customer) {
              res.redirect ('customers');
              return;
            } else {
              customer.full_name = full_name;
              customer.address = address;
              customer.phone = phone;
              customer.date = date;
            }
            return customer.save ();
          });
        });
      });
    } else {
    }
  }
};
