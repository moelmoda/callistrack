import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { authenticate, requireAdmin } from '../middleware/auth';
import pool from '../db/pool';

const router = Router();

/**
 * GET /api/events
 * Returns all upcoming events with participant count and join status.
 */
router.get('/', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.query(
      `SELECT e.*,
        u.username AS creator_name,
        COUNT(ep.user_id)::int AS participant_count,
        EXISTS(
          SELECT 1 FROM event_participants WHERE event_id = e.id AND user_id = $1
        ) AS is_joined
       FROM events e
       LEFT JOIN users u ON u.id = e.created_by
       LEFT JOIN event_participants ep ON ep.event_id = e.id
       WHERE e.event_date >= NOW()
       GROUP BY e.id, u.username
       ORDER BY e.event_date ASC`,
      [req.user!.userId]
    );
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/events
 * Create a new event. Admin only.
 */
router.post('/',
  authenticate,
  requireAdmin,
  [
    body('title').trim().isLength({ min: 2, max: 150 }),
    body('event_date').isISO8601(),
    body('location').notEmpty(),
  ],
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) { res.status(400).json({ errors: errors.array() }); return; }

    try {
      const result = await pool.query(
        `INSERT INTO events (title, description, location, event_date, created_by)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [req.body.title, req.body.description ?? null, req.body.location, req.body.event_date, req.user!.userId]
      );
      res.status(201).json(result.rows[0]);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
);

/**
 * POST /api/events/:id/join
 * Join an event.
 */
router.post('/:id/join', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    await pool.query(
      `INSERT INTO event_participants (event_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [req.params.id, req.user!.userId]
    );
    res.json({ message: 'Event beigetreten' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * DELETE /api/events/:id/join
 * Leave an event.
 */
router.delete('/:id/join', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    await pool.query(
      `DELETE FROM event_participants WHERE event_id = $1 AND user_id = $2`,
      [req.params.id, req.user!.userId]
    );
    res.json({ message: 'Event verlassen' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * DELETE /api/events/:id
 * Delete an event. Admin only.
 */
router.delete('/:id', authenticate, requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    await pool.query('DELETE FROM events WHERE id = $1', [req.params.id]);
    res.json({ message: 'Event gelöscht' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
