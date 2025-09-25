import { Request, Response } from 'express';
import Employee from '../models/Employee';
import bcrypt from 'bcryptjs';
import { success, fail } from '../utils/response';

export const getProfile = async (req: Request, res: Response) => {
  try {
    const id = req.params.id || (req as any).user?.id;
    const emp = await Employee.findOne({ id });
    if (!emp) return fail(res, 'Employee not found', null, 404);
    const completedSteps = emp.steps.filter(s => s.status === 'completed').length;
    const pendingSteps = emp.steps.filter(s => s.status === 'pending').map(s => s.stepNo);
    const payload = {
      id: emp.id, name: emp.name, email: emp.email, contact: emp.contact, joiningDate: emp.joiningDate,
      steps: emp.steps, completedSteps, pendingSteps, status: emp.status
    };
    return success(res, payload);
  } catch (err) {
    console.error(err);
    return fail(res, 'Get profile failed', err);
  }
};

export const updateStepStatus = async (req: Request, res: Response) => {
  try {
    const { id, stepNo } = req.params;
    const { status } = req.body;
    const emp = await Employee.findOne({ id });
    if (!emp) return fail(res, 'Employee not found', null, 404);

    const step = emp.steps.find(s => String(s.stepNo) === String(stepNo));
    if (!step) return fail(res, 'Step not found', null, 404);
    step.status = status === 'completed' ? 'completed' : 'pending';
    const allCompleted = emp.steps.every(s => s.status === 'completed');
    emp.status = allCompleted ? 'completed' : (emp.steps.some(s=>s.status==='completed') ? 'in_progress' : 'pending');
    await emp.save();
    return success(res, { id: emp.id, stepNo: step.stepNo, status: step.status });
  } catch (err) {
    console.error(err);
    return fail(res, 'Update step failed', err);
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { oldPassword, newPassword } = req.body;
    const emp = await Employee.findOne({ id });
    if (!emp) return fail(res, 'Employee not found', null, 404);
    if (!emp.password) return fail(res, 'No password set', null, 403);
    const ok = await bcrypt.compare(oldPassword, emp.password);
    if (!ok) return fail(res, 'Old password incorrect', null, 401);
    emp.password = await bcrypt.hash(newPassword, 10);
    await emp.save();
    return success(res, null, 'Password changed');
  } catch (err) {
    console.error(err);
    return fail(res, 'Change password failed', err);
  }
};
