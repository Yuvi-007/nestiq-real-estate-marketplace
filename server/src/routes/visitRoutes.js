const express = require('express')

const {
  createVisit,
  getVisits,
  updateVisitStatus,
} = require('../controllers/visitController')
const authMiddleware = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/', authMiddleware, createVisit)
router.get('/', authMiddleware, getVisits)
router.patch('/:id/status', authMiddleware, updateVisitStatus)

module.exports = router
