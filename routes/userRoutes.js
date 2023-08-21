const express = require('express')
const {
  login,
  register,
  getCurrentUser,
} = require('../controllers/userController')
const validateToken = require('../middleware/validateTokenHandler')
const router = express.Router()

router.route('/register').post(register)

router.route('/login').post(login)

router.route('/current').get(validateToken, getCurrentUser)

module.exports = router
