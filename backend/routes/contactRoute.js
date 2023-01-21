const express = require('express');
const { contactUs } = require('../controllers/contactController');
const { protect } = require('../middleWares/authMiddleware');
const router = express.Router();

router.post("/", protect, contactUs);
module.exports = router;