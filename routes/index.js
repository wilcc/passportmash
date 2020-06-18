const express = require('express')
const router = express.Router()
const controller = require('../controller/controller')

router.get('/movies', controller.movies)
router.get('/random', controller.random)

module.exports = router