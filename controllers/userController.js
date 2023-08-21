const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

//@desc Register a user
//@route POST /api/users/register
//access public
const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body
  if (!username || !email || !password) {
    res.status(400)
    throw new Error('All fields are mandatory!')
  }
  const userAvailable = await User.findOne({ email })
  if (userAvailable) {
    res.status(400)
    throw new Error('User already register')
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  const user = await User.create({
    username,
    email,
    password: hashedPassword,
  })
  console.log(`User created ${user}`)

  if (user) {
    res.status(201).json({ _id: user.id, email: user.email })
  } else {
    res.status(400)
    throw new Error('User data us not valid')
  }
  res.json({ message: 'Register the user' })
})

//@desc Login a user
//@route POST /api/users/login
//access public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    res.status(400)
    throw new Error('All fields are mandatory!')
  }

  const user = await User.findOne({ email })
  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = jwt.sign(
      {
        user: {
          username: user.username,
          email: user.email,
          id: user.id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: '11m',
      }
    )
    res.status(200).json({ accessToken })
  } else {
    res.status(401)
    throw new Error('email or password is not valid')
  }
})

//@desc get currentUser
//@route GET /api/users/current
//access private
const getCurrentUser = asyncHandler(async (req, res) => {
  res.json(req.user)
})

module.exports = { register, login, getCurrentUser }
