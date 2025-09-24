import { Router } from 'express';
import { adminLogin, employeeLogin } from '../controllers/authController';
const router = Router();

router.post('/admin/login', adminLogin);
router.post('/employee/login', employeeLogin);

export default router;
