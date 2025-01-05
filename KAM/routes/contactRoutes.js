//contactRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all contacts for a lead
router.get('/lead/:leadId', async (req, res) => {
  try {
    const [contacts] = await db.promise().query('SELECT * FROM contacts WHERE lead_id = ?', [req.params.leadId]);
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a new contact
router.post('/', async (req, res) => {
  const { lead_id, name, role, phone_number, email } = req.body;
  try {
    const [result] = await db.promise().query(
      'INSERT INTO contacts (lead_id, name, role, phone_number, email) VALUES (?, ?, ?, ?, ?)',
      [lead_id, name, role, phone_number, email]
    );
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 