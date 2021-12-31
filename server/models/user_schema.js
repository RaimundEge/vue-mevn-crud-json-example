const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'name field is required'],
    },
    password: {
      type: String,
      required: [true, 'password field is required'],
    },
    roles: {
      type: Array,
      required: [true, 'roles field is required'],
    },
  },
  { timestamps: true },
);

module.exports = model('users', userSchema);
