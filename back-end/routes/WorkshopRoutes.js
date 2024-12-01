const express = require('express');
const WorkshopController = require('../controllers/WorkshopController');

const router = express.Router();

router.post('/workshops', WorkshopController.createWorkshop);
router.get('/workshops', WorkshopController.listWorkshops);
router.get('/workshops/:id', WorkshopController.getWorkshopById);
router.post('/workshops/students', WorkshopController.addStudents);
router.delete('/workshops/students', WorkshopController.removeStudent);
router.post('/workshops/:id/finalize', WorkshopController.finalizeWorkshop);
module.exports = router;
