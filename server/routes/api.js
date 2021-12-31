const express = require('express');


const {
  register,
  login,
  readUsers,
  updateData,
  deleteData,
} = require('../controllers/user_controller');

const router = express.Router();

router
  .post('/register', register)
  .post('/login', login)
  .get('/users', readUsers)
  .put('/:id', updateData)
  .delete('/:id', deleteData);

module.exports = router;
