const express = require('express')

const {
  deleteAdminUser,
  getAdminProperties,
  getAdminStats,
  getAdminUsers,
  setAdminPropertyApproved,
  setAdminPropertyRejected,
  setAdminPropertyStatus,
  updateAdminUser,
} = require('../controllers/adminController')
const authMiddleware = require('../middleware/authMiddleware')
const roleGuard = require('../middleware/roleGuard')

const router = express.Router()

router.use(authMiddleware)
router.use(roleGuard('admin'))

router.get('/stats', getAdminStats)
router.get('/users', getAdminUsers)
router.patch('/users/:id', updateAdminUser)
router.delete('/users/:id', deleteAdminUser)
router.get('/properties', getAdminProperties)
router.patch('/properties/:id/approve', setAdminPropertyApproved)
router.patch('/properties/:id/reject', setAdminPropertyRejected)
router.patch('/properties/:id/status', setAdminPropertyStatus)

module.exports = router
