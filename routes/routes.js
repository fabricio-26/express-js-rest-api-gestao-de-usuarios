var express = require("express")
var app = express();
var router = express.Router();
var HomeController = require("../controllers/HomeController");
let UserController = require("../controllers/UserControler")

router.get('/', HomeController.index);
router.post('/user', UserController.create)

module.exports = router;