const mongose = require ('mongoose');

const CustomerSchema = new mongose.Schema ({
  full_name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  image_path: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
});

const Customer = mongose.model ('Customer', CustomerSchema);

module.exports = Customer;
