const express = require('express');
const router = express.Router();
const userUpdationsController = require('../controller/userUpdations.controller');

router.post('/sync', userUpdationsController.syncUserSubmissions);
router.post('/sync/daily', userUpdationsController.syncDaily);
router.post('/create', userUpdationsController.createUser);
router.post('/platform', userUpdationsController.addPlatformHandles);

module.exports = router;
