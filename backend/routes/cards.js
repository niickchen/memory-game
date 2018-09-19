const Router = require('koa-router')
const router = new Router()
const Cards = require('../controllers/cards')

router.get('/', Cards.startNewGame)
router.post('/', Cards.startNewGame)
router.get('/max', Cards.getMaxScore)
router.post('/max', Cards.setMaxScore)
router.post('/getcolor', Cards.getColor)

module.exports = router.routes()
