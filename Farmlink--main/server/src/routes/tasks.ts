import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { db, type FarmingTaskItem } from '../db/store.js';
import { validate } from '../middleware/validate.js';
import { taskSchema } from '../validators/schemas.js';

const router = Router();
router.use(authenticate);

router.get('/', (req, res) => {
  const userId = req.user!.id;
  const userTasks = db.tasks.get(userId) || [];
  res.json({ data: userTasks });
});

router.post('/', validate(taskSchema), (req, res) => {
  const userId = req.user!.id;
  const userTasks = db.tasks.get(userId) || [];
  const newTask: FarmingTaskItem = {
    id: 'task-' + Date.now(),
    user_id: userId,
    title: req.body.title,
    description: req.body.description,
    priority: req.body.priority || 'normal',
    due_at: req.body.due_at || new Date().toISOString(),
    completed_at: null,
    duration_minutes: req.body.duration_minutes ? Number(req.body.duration_minutes) : undefined,
    time_spent_seconds: req.body.time_spent_seconds ? Number(req.body.time_spent_seconds) : 0,
    created_at: new Date().toISOString(),
  };

  userTasks.unshift(newTask);
  db.tasks.set(userId, userTasks);
  res.status(201).json({ data: newTask });
});

router.patch('/:id', (req, res) => {
  const userId = req.user!.id;
  const userTasks = db.tasks.get(userId) || [];
  const task = userTasks.find((t) => t.id === req.params.id);
  if (!task) {
    res.status(404).json({ error: 'Task not found' });
    return;
  }

  if (req.body.completed_at !== undefined) task.completed_at = req.body.completed_at;
  if (req.body.title) task.title = req.body.title;
  if (req.body.description) task.description = req.body.description;
  if (req.body.priority) task.priority = req.body.priority;
  if (req.body.duration_minutes !== undefined) task.duration_minutes = req.body.duration_minutes ? Number(req.body.duration_minutes) : undefined;
  if (req.body.time_spent_seconds !== undefined) task.time_spent_seconds = Number(req.body.time_spent_seconds);

  res.json({ data: task });
});

router.delete('/:id', (req, res) => {
  const userId = req.user!.id;
  const userTasks = db.tasks.get(userId) || [];
  const filtered = userTasks.filter((t) => t.id !== req.params.id);
  db.tasks.set(userId, filtered);
  res.status(204).end();
});

export default router;
