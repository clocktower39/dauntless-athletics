import pg from "pg";

const { Pool } = pg;

const sslEnabled = process.env.DATABASE_SSL === "true";

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: sslEnabled ? { rejectUnauthorized: false } : false,
});

export const query = (text, params) => pool.query(text, params);

export const getClient = () => pool.connect();
