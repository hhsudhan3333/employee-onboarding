import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import Employee from '../models/Employee';
import { success, fail } from '../utils/response';
import { v4 as uuidv4 } from 'uuid';

export const createEmployee = async (req: Request, res: Response) => {
  try {
    const { name, email, contact, joiningDate, password } = req.body;
    if (!name || !email) return fail(res, 'Name and email required', null, 400);

    const existing = await Employee.findOne({ email });
    if (existing) return fail(res, 'Employee with this email already exists', null, 400);

    const tempPassword = password || (uuidv4().slice(0,8));
    const hashed = await bcrypt.hash(tempPassword, 10);

    const emp = await Employee.create({
      name,
      email,
      contact,
      joiningDate: joiningDate ? new Date(joiningDate) : undefined,
      password: hashed
    });
    
    const out = {
      id: emp.id,
      name: emp.name,
      email: emp.email,
      contact: emp.contact,
      joiningDate: emp.joiningDate,
      tempPassword
    };

    return success(res, out, 'Employee created');
  } catch (err) {
    console.error(err);
    return fail(res, 'Create employee failed', err);
  }
};

export const listEmployees = async (req: Request, res: Response) => {
  try {
    const docs = await Employee.find().sort({ createdAt: -1 });
    const data = docs.map(emp => {
      const completedSteps = emp.steps.filter(s => s.status === 'completed').length;
      const pendingSteps = emp.steps.filter(s => s.status === 'pending').map(s => s.stepNo);
      return {
        id: emp.id,
        name: emp.name,
        email: emp.email,
        contact: emp.contact,
        joiningDate: emp.joiningDate,
        completedSteps,
        pendingSteps,
        status: emp.status
      };
    });
    return success(res, data);
  } catch (err) {
    console.error(err);
    return fail(res, 'List employees failed', err);
  }
};
