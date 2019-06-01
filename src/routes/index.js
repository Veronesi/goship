const { Router } = require('express')
const router = Router()

const goShipController = require('../controllers/goShipController')

router.get('/', goShipController.list)
router.post('/add', goShipController.save)
router.post('/api/login', goShipController.login)

module.exports = router;