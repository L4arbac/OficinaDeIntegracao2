const express = require('express');
const WorkshopController = require('../controllers/WorkshopController');

const router = express.Router();

router.post('/workshops', WorkshopController.createWorkshop);
router.get('/workshops', WorkshopController.listWorkshops);
router.get('/workshops/:id', WorkshopController.getWorkshopById);
router.post('/workshops/students', WorkshopController.addStudents);
router.delete('/workshops/students', WorkshopController.removeStudent);
router.post('/workshops/:id/finalize', WorkshopController.finalizeWorkshop);

// Nova rota para listar certificados de um workshop
router.get('/workshops/:id/certificates', WorkshopController.listCertificates);

router.get('/workshops/:id/certificates/:filename', WorkshopController.downloadCertificate);

// Nova rota para baixar um certificado específico
//router.get('/workshops/:id/certificates/:filename', WorkshopController.downloadCertificate);

module.exports = router;
