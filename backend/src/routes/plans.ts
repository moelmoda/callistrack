import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { authenticate } from '../middleware/auth';
import pool from '../db/pool';

const router = Router();

/**
 * GET /api/plans
 * Returns all training plans for the authenticated user.
 */
router.get('/', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const plans = await pool.query(
      `SELECT p.*, 
        json_agg(
          json_build_object('id', e.id, 'name', e.name, 'sets', e.sets, 'reps', e.reps, 'notes', e.notes, 'order_index', e.order_index)
          ORDER BY e.order_index
        ) FILTER (WHERE e.id IS NOT NULL) AS exercises
       FROM training_plans p
       LEFT JOIN plan_exercises e ON e.plan_id = p.id
       WHERE p.user_id = $1
       GROUP BY p.id
       ORDER BY p.created_at DESC`,
      [req.user!.userId]
    );
    res.json(plans.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/plans
 * Creates a new training plan with exercises.
 */
router.post('/',
  authenticate,
  [
    body('name').trim().isLength({ min: 2, max: 150 }).withMessage('Name 2–150 Zeichen'),
    body('exercises').isArray({ min: 1 }).withMessage('Mindestens eine Übung'),
    body('exercises.*.name').notEmpty().withMessage('Übungsname erforderlich'),
    body('exercises.*.sets').isInt({ min: 1 }),
    body('exercises.*.reps').isInt({ min: 1 }),
  ],
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) { res.status(400).json({ errors: errors.array() }); return; }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const planRes = await client.query(
        `INSERT INTO training_plans (user_id, name, description)
         VALUES ($1, $2, $3) RETURNING *`,
        [req.user!.userId, req.body.name, req.body.description ?? null]
      );
      const plan = planRes.rows[0];

      for (let i = 0; i < req.body.exercises.length; i++) {
        const ex = req.body.exercises[i];
        await client.query(
          `INSERT INTO plan_exercises (plan_id, name, sets, reps, notes, order_index)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [plan.id, ex.name, ex.sets, ex.reps, ex.notes ?? null, i]
        );
      }

      await client.query('COMMIT');
      res.status(201).json(plan);
    } catch (err: any) {
      await client.query('ROLLBACK');
      res.status(500).json({ error: err.message });
    } finally {
      client.release();
    }
  }
);

/**
 * DELETE /api/plans/:id
 * Deletes a training plan.
 */
router.delete('/:id', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    await pool.query(
      'DELETE FROM training_plans WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user!.userId]
    );
    res.json({ message: 'Plan gelöscht' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
