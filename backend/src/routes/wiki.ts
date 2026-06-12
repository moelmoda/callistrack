import { Router, Request, Response } from 'express';
import pool from '../db/pool';

const router = Router();

/**
 * GET /api/wiki
 * Returns all exercises from the wiki.
 * Optional query: ?search=klimmzug&difficulty=Mittel&muscle_group=Rücken
 */
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { search, difficulty, muscle_group } = req.query;

    let query = 'SELECT * FROM exercises_wiki WHERE 1=1';
    const params: any[] = [];

    if (search) {
      params.push(`%${search}%`);
      query += ` AND (name ILIKE $${params.length} OR description ILIKE $${params.length})`;
    }

    if (difficulty) {
      params.push(difficulty);
      query += ` AND difficulty = $${params.length}`;
    }

    if (muscle_group) {
      params.push(muscle_group);
      query += ` AND muscle_group = $${params.length}`;
    }

    query += ' ORDER BY difficulty, name';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/wiki/:id
 * Returns a single exercise by ID.
 */
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.query(
      'SELECT * FROM exercises_wiki WHERE id = $1',
      [req.params.id]
    );
    if (!result.rowCount) {
      res.status(404).json({ error: 'Übung nicht gefunden' });
      return;
    }
    res.json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
