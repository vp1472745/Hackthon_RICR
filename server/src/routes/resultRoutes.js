// routes/resultRoutes.js
import express from 'express';
import multer from 'multer';
import {
  getResultsWithTeamAndLeader,
  exportResultsExcel,
  createResult,
  updateResult,
  deleteResult,
  deleteAllResults,
  importResultsExcel,
  declareResults
} from '../controller/resultController.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // use memory for Excel parsing

router.get('/all-with-team-leader', getResultsWithTeamAndLeader);
router.get('/export-excel', exportResultsExcel);
router.post('/', createResult);
router.put('/:id', updateResult);
router.delete('/:id', deleteResult);
router.delete('/all/delete-all', deleteAllResults);
router.post('/import-excel', upload.single('file'), importResultsExcel);
router.patch('/declare-results', declareResults);

export default router;
