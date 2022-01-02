'use strict';
const bcrypt = require('bcrypt');
const saltRounds = process.env.BCRYPT_ROUNDS;
const secret = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');
const User = require('../models/user_schema');

const register = (req, res) => {
  var user = { name: req.body.name }
  console.log(user)
  User.find(user)
    .then((data) => {
      console.log('find returned', data);
      if (data.length > 0) {
        res.status(200).json({ msg: 'User name already exist' });
      } else {
        bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
          user = req.body;
          user.password = hash;
          User.create(user)
            .then((data) => {
              console.log('New User Created!', data);
              res.status(201).json(data);
            })
            .catch((err) => {
              if (err.name === 'ValidationError') {
                console.error('Error Validating!', err);
                res.status(422).json(err);
              } else {
                console.error(err);
                res.status(500).json(err);
              }
            });
        })
      }
    })
};

const login = (req, res) => {
  var user = { name: req.body.name };
  console.log(user);
  User.find(user)
    .then((data) => {
      if (data.length > 0) {
        console.log('found: ', data);
        user = data[0];
        bcrypt.compare(req.body.password, user.password, (err, result) => {
          if (result) {
            console.log(data);
            var result = {
              user: user,
              token: jwt.sign(JSON.stringify(user), secret)
            };
            res.status(200).json(result);
          } else {
            res.status(401).json({ msg: 'user/password incorrect' });
          }
        })
      } else {
        res.status(401).json({ msg: 'user/password incorrect' });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json(err);
    });
};

const readUsers = (req, res) => {
  User.find()
    .then(data => {
      res.status(200).json(data);
    })
}

const updateData = async (req, res) => {
  if (req.body.password.substring(0, 4) == "NEW:") {
    console.log(req.body.password.substring(4));
    req.body.password = await bcrypt.hash(req.body.password.substring(4), saltRounds);
  }
  console.log(req.body);
  User.findByIdAndUpdate(req.params.id, req.body, {
    useFindAndModify: false,
    new: true,
  })
    .then((data) => {
      console.log('User updated!');
      res.status(201).json(data);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        console.error('Error Validating !', err);
        res.status(422).json(err);
      } else {
        console.error(err);
        res.status(500).json(err);
      }
    });
};

const deleteData = (req, res) => {
  User.findById(req.params.id)
    .then((data) => {
      if (!data) {
        throw new Error('User not available');
      }
      return data.remove();
    })
    .then((data) => {
      console.log('User removed!');
      res.status(200).json(data);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json(err);
    });
};

module.exports = {
  register,
  login,
  readUsers,
  updateData,
  deleteData,
};
