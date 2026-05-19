const express = require('express')

const {
  getProperties,
  searchProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  saveProperty,
} = require('../controllers/propertyController')
const authMiddleware = require('../middleware/authMiddleware')
const roleGuard = require('../middleware/roleGuard')

const router = express.Router()

router.get('/', getProperties)
router.get('/search', searchProperties)
router.get('/:id', getPropertyById)
router.post('/', authMiddleware, roleGuard('seller', 'agent', 'admin'), createProperty)
router.put('/:id', authMiddleware, roleGuard('seller', 'agent', 'admin'), updateProperty)
router.delete('/:id', authMiddleware, roleGuard('seller', 'agent', 'admin'), deleteProperty)
router.post('/:id/save', authMiddleware, saveProperty)

module.exports = router
