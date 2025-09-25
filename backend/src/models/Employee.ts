import { Schema, model, Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { DEFAULT_STEPS } from '../utils/generateSteps';

export type Step = {
  stepNo: number;
  name: string;
  status: 'pending' | 'completed';
};

export interface IEmployee extends Document {
  id: string;
  name: string;
  contact?: string;
  email: string;
  joiningDate?: Date;
  password?: string;
  steps: Step[];
  status: 'pending' | 'in_progress' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

const StepSchema = new Schema<Step>({
  stepNo: { type: Number, required: true },
  name: { type: String, required: true },
  status: { type: String, enum: ['pending','completed'], default: 'pending' }
}, { _id: false });

const EmployeeSchema = new Schema<IEmployee>({
  id: { type: String, default: uuidv4, unique: true },
  name: { type: String, required: true },
  contact: { type: String },
  email: { type: String, required: true, unique: true, index: true },
  joiningDate: { type: Date },
  password: { type: String },
  steps: { type: [StepSchema], default: () => DEFAULT_STEPS.map(step => ({ ...step })) }, 
  status: { type: String, enum: ['pending','in_progress','completed'], default: 'pending' }
}, { timestamps: true });

export default model<IEmployee>('Employee', EmployeeSchema);
