const jwt = require('jsonwebtoken')

const requireSecret = (name) => {
  const secret = process.env[name]

  if (!secret) {
    throw new Error(`${name} is not configured`)
  }

  return secret
}

const generateAccessToken = (userId) =>
  jwt.sign({ id: userId }, requireSecret('JWT_ACCESS_SECRET'), {
    expiresIn: '15m',
  })

const generateRefreshToken = (userId) =>
  jwt.sign({ id: userId }, requireSecret('JWT_REFRESH_SECRET'), {
    expiresIn: '7d',
  })

const generateTokens = (userId) => ({
  accessToken: generateAccessToken(userId),
  refreshToken: generateRefreshToken(userId),
})

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  generateTokens,
}
