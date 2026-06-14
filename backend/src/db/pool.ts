import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  family: 4  // IPv4 erzwingen
});

pool.on('error', (err) => {
  console.error('Unerwarteter Fehler am DB pool:', err);
});

export default pool;
