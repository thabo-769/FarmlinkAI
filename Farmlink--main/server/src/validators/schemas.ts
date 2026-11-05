import { z } from 'zod';
export const registerSchema=z.object({email:z.string().email(),password:z.string().min(8),fullName:z.string().min(2).max(100),role:z.enum(['farmer','buyer','supplier']).default('farmer'),location:z.string().max(120).optional()});
export const loginSchema=z.object({email:z.string().email(),password:z.string().min(8)});
export const productSchema=z.object({name:z.string().min(2).max(120),category:z.string().min(2).max(60),description:z.string().min(10).max(3000),price:z.number().positive(),currency:z.enum(['USD','ZWL']),quantity:z.number().positive(),unit:z.string().min(1).max(30),location:z.string().min(2).max(160)});
export const taskSchema=z.object({title:z.string().min(2).max(160),description:z.string().max(1000).optional(),due_at:z.string().datetime().optional(),priority:z.enum(['low','normal','high']).default('normal'),duration_minutes:z.number().optional(),time_spent_seconds:z.number().optional()});
export const chatSchema=z.object({message:z.string().min(2).max(3000),conversationId:z.string().uuid().optional()});
