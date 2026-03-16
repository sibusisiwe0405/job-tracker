const express = require('express');
const router = express.Router();
const {
  getApplications,
  getApplication,
  createApplication,
  updateApplication,
  deleteApplication
} = require('../controllers/applicationController');

router.get('/', getApplications);
router.get('/:id', getApplication);
router.post('/', createApplication);
router.put('/:id', updateApplication);
router.delete('/:id', deleteApplication);

module.exports = router;