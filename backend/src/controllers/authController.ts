import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin';
import Employee from '../models/Employee';
import { success, fail } from '../utils/response';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

const plainPassword = "Admin@123";
bcrypt.hash(plainPassword, 10).then((hash) => {
  console.log("Hashed Password:", hash);
});

export const adminLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return fail(res, 'Invalid credentials', null, 401);
    const ok = await bcrypt.compare(password, admin.password);
    if (!ok) return fail(res, 'Invalid credentials', null, 401);
    const token = jwt.sign({ id: admin.id, role: 'admin', email: admin.email }, JWT_SECRET, { expiresIn: "1h" });
    return success(res, { token, admin: { id: admin.id, name: admin.name, email: admin.email } });
  } catch (err) {
    console.error(err);
    return fail(res, 'Login error', err);
  }
};

export const employeeLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const emp = await Employee.findOne({ email });
    if (!emp) return fail(res, 'Invalid credentials', null, 401);
    if (!emp.password) return fail(res, 'No login set for this employee', null, 403);
    const ok = await bcrypt.compare(password, emp.password);
    if (!ok) return fail(res, 'Invalid credentials', null, 401);
    const token = jwt.sign({ id: emp.id, role: 'employee', email: emp.email }, JWT_SECRET, { expiresIn: "1h" });
    return success(res, { token, employee: { id: emp.id, name: emp.name, email: emp.email } });
  } catch (err) {
    console.error(err);
    return fail(res, 'Login error', err);
  }
};
