const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { generateAccessToken, generateTokens } = require('../utils/generateTokens')

const allowedRoles = ['buyer', 'seller', 'agent', 'admin']
const emailRegex = /^\S+@\S+\.\S+$/

const refreshCookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  maxAge: 7 * 24 * 60 * 60 * 1000,
}

const clearRefreshCookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
}

const cleanUser = (user) => {
  const userObject = user.toObject ? user.toObject() : { ...user }
  delete userObject.password
  return userObject
}

const validateRegisterInput = ({ name, email, password, role }) => {
  if (!name || !email || !password) {
    return 'Name, email, and password are required'
  }

  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address'
  }

  if (password.length < 6) {
    return 'Password must be at least 6 characters'
  }

  if (role && !allowedRoles.includes(role)) {
    return 'Role must be buyer, seller, agent, or admin'
  }

  return null
}

const validateLoginInput = ({ email, password }) => {
  if (!email || !password) {
    return 'Email and password are required'
  }

  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address'
  }

  return null
}

const register = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body
    const validationError = validateRegisterInput({ name, email, password, role })

    if (validationError) {
      return res.status(400).json({ message: validationError })
    }

    const normalizedEmail = email.toLowerCase().trim()
    const existingUser = await User.findOne({ email: normalizedEmail })

    if (existingUser) {
      return res.status(409).json({ message: 'An account with this email already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      phone,
      role: role || 'buyer',
    })

    const { accessToken, refreshToken } = generateTokens(user._id)

    res.cookie('refreshToken', refreshToken, refreshCookieOptions)
    return res.status(201).json({
      success: true,
      message: 'Registration successful',
      accessToken,
      data: cleanUser(user),
    })
  } catch (error) {
    console.error('Register error:', error.message)

    if (error.name === 'ValidationError') {
      const firstError = Object.values(error.errors)[0]
      return res.status(400).json({ message: firstError.message })
    }

    return res.status(500).json({ message: 'Unable to register user' })
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const validationError = validateLoginInput({ email, password })

    if (validationError) {
      return res.status(400).json({ message: validationError })
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password')

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const passwordMatches = await bcrypt.compare(password, user.password)

    if (!passwordMatches) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const { accessToken, refreshToken } = generateTokens(user._id)

    res.cookie('refreshToken', refreshToken, refreshCookieOptions)
    return res.json({
      success: true,
      message: 'Login successful',
      accessToken,
      data: cleanUser(user),
    })
  } catch (error) {
    console.error('Login error:', error.message)
    return res.status(500).json({ message: 'Unable to login' })
  }
}

const refresh = async (req, res) => {
  try {
    const token = req.cookies.refreshToken

    if (!token) {
      return res.status(401).json({ message: 'Refresh token is required' })
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
    const user = await User.findById(decoded.id).select('-password')

    if (!user) {
      return res.status(401).json({ message: 'Invalid refresh token' })
    }

    const accessToken = generateAccessToken(user._id)

    return res.json({
      success: true,
      message: 'Access token refreshed',
      accessToken,
    })
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired refresh token' })
  }
}

const me = async (req, res) => {
  return res.json({
    success: true,
    data: cleanUser(req.user),
  })
}

const logout = async (req, res) => {
  res.clearCookie('refreshToken', clearRefreshCookieOptions)
  return res.json({
    success: true,
    message: 'Logged out successfully',
  })
}

module.exports = {
  register,
  login,
  refresh,
  me,
  logout,
}
