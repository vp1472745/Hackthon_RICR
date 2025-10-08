import express from 'express';
import { createAccomodation, getAllAccomodations, getAccomodationById, updateAccomodation, deleteAccomodation } from '../controller/accomodationController.js';

const router = express.Router();

router.post('/', createAccomodation);
router.get('/', getAllAccomodations);
router.get('/:id', getAccomodationById);
router.put('/:id', updateAccomodation);
router.delete('/:id', deleteAccomodation);

export default router;
