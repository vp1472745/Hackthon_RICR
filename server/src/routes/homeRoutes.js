import express from 'express';
import { getAllThemes } from '../controller/homeController.js';

const router = express.Router();
router.get('/', getAllThemes);

export default router;