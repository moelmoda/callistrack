import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { authenticate } from '../middleware/auth';
import pool from '../db/pool';

const router = Router();

/**
 * GET /api/communities
 * Returns all communities with member count and whether current user is a member.
 */
router.get('/', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.query(
      `SELECT c.*,
        COUNT(cm.user_id)::int AS member_count,
        EXISTS(
          SELECT 1 FROM community_members 
          WHERE community_id = c.id AND user_id = $1
        ) AS is_member
       FROM communities c
       LEFT JOIN community_members cm ON cm.community_id = c.id
       GROUP BY c.id
       ORDER BY member_count DESC`,
      [req.user!.userId]
    );
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/communities
 * Creates a new community.
 */
router.post('/',
  authenticate,
  [
    body('name').trim().isLength({ min: 2, max: 150 }).withMessage('Name 2–150 Zeichen'),
  ],
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) { res.status(400).json({ errors: errors.array() }); return; }

    try {
      const result = await pool.query(
        `INSERT INTO communities (name, description, created_by)
         VALUES ($1, $2, $3) RETURNING *`,
        [req.body.name, req.body.description ?? null, req.user!.userId]
      );
      // Auto-join creator
      await pool.query(
        `INSERT INTO community_members (community_id, user_id) VALUES ($1, $2)`,
        [result.rows[0].id, req.user!.userId]
      );
      res.status(201).json(result.rows[0]);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
);

/**
 * POST /api/communities/:id/join
 * Join a community.
 */
router.post('/:id/join', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    await pool.query(
      `INSERT INTO community_members (community_id, user_id)
       VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [req.params.id, req.user!.userId]
    );
    res.json({ message: 'Community beigetreten' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * DELETE /api/communities/:id/join
 * Leave a community.
 */
router.delete('/:id/join', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    await pool.query(
      `DELETE FROM community_members WHERE community_id = $1 AND user_id = $2`,
      [req.params.id, req.user!.userId]
    );
    res.json({ message: 'Community verlassen' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
