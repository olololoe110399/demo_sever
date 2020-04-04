const mongose = require ('mongoose');

const AdminSchema = new mongose.Schema ({
  full_name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
    date: {
    type: Date,
    default: Date.now,
  },
});

const Admin = mongose.model ('Admin', AdminSchema);

module.exports = Admin;
