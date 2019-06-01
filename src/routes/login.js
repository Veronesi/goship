const { Router } = require('express')
const router = Router()

const users = require('../users.json')
console.log(users);

router.get('/', function (req, res) {
    res.json(users)
});

module.exports = router;