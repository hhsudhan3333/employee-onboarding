import { Router } from 'express';
import { createEmployee, listEmployees } from '../controllers/adminController';
import { authMiddleware, adminOnly } from '../middleware/auth';
const router = Router();

router.use(authMiddleware, adminOnly);

router.post('/employees', createEmployee);
router.get('/employees', listEmployees);
// router.put('/employees/:id/access', giveAccess);

export default router;
