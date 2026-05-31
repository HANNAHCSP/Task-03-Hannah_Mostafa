const express = require('express');
const { Pool } = require('pg');

const app = express();
app.use(express.json());

// 1. Connect directly to your Neon PostgreSQL cloud vault
const pool = new Pool({
    connectionString: "postgresql://neondb_owner:npg_vT3snqkHxrG2@ep-old-sunset-ap06mpqh-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
});

// 2. READ OPERATION (GET /users) - Fetches records straight from the database
app.get('/users', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users;');
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. CREATE OPERATION (POST /users) - Saves records using secure parameterized queries
app.post('/users', async (req, res) => {
    const { name, role } = req.body;

    if (!name || !role) {
        return res.status(400).json({ error: "Fields 'name' and 'role' are required" });
    }

    try {
        const result = await pool.query(
            'INSERT INTO users (name, role) VALUES ($1, $2) RETURNING *;',
            [name.trim(), role.trim()]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(5000, () => console.log('Server running cleanly on port 5000'));