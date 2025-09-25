import { Router } from 'express';
import { getProfile, updateStepStatus, changePassword } from '../controllers/employeeController';
import { authMiddleware } from '../middleware/auth';
import { Request, Response } from "express";

const router = Router();

router.use(authMiddleware);

router.get('/', getProfile);
router.put('/:id/steps/:stepNo', updateStepStatus);
router.put('/:id/password', changePassword);

export default router;
