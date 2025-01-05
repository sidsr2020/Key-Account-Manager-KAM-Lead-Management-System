const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all leads with optional search
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let query = 'SELECT * FROM leads';
    let params = [];

    if (search) {
      query = `
        SELECT * FROM leads 
        WHERE restaurant_name LIKE ? 
        OR address LIKE ? 
        OR contact_number LIKE ?
        OR assigned_kam LIKE ?
      `;
      const searchParam = `%${search}%`;
      params = [searchParam, searchParam, searchParam, searchParam];
    }

    query += ' ORDER BY created_at DESC';
    const [leads] = await db.promise().query(query, params);
    res.json(leads);
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
});

// Search leads (dedicated endpoint)
router.get('/search', async (req, res) => {
    try {
      const { query } = req.query;
      
      // Return empty array for empty search
      if (!query || query.trim().length === 0) {
        return res.json([]);
      }
  
      const searchQuery = `
        SELECT l.*, 
          COUNT(DISTINCT c.id) as contact_count,
          COUNT(DISTINCT i.id) as interaction_count,
          MAX(i.created_at) as last_interaction
        FROM leads l
        LEFT JOIN contacts c ON l.id = c.lead_id
        LEFT JOIN interactions i ON l.id = i.lead_id
        WHERE 
          l.restaurant_name LIKE ? OR
          l.address LIKE ? OR
          l.contact_number LIKE ? OR
          l.assigned_kam LIKE ?
        GROUP BY l.id
        ORDER BY l.created_at DESC
      `;
  
      const searchParam = `%${query.trim()}%`;
      const [leads] = await db.promise().query(
        searchQuery, 
        [searchParam, searchParam, searchParam, searchParam]
      );
      
      res.json(leads);
    } catch (error) {
      console.error('Error searching leads:', error);
      res.status(500).json({ error: 'Failed to search leads' });
    }
  });

// Get single lead by ID with related data
router.get('/:id', async (req, res) => {
  try {
    const queries = [
      db.promise().query('SELECT * FROM leads WHERE id = ?', [req.params.id]),
      db.promise().query('SELECT * FROM contacts WHERE lead_id = ?', [req.params.id]),
      db.promise().query('SELECT * FROM interactions WHERE lead_id = ?', [req.params.id])
    ];

    const [[leads], [contacts], [interactions]] = await Promise.all(queries);

    if (leads.length === 0) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    const lead = leads[0];
    lead.contacts = contacts;
    lead.interactions = interactions;

    res.json(lead);
  } catch (error) {
    console.error('Error fetching lead details:', error);
    res.status(500).json({ error: 'Failed to fetch lead details' });
  }
});

// Create a new lead
router.post('/', async (req, res) => {
  const { restaurant_name, address, contact_number, status, assigned_kam } = req.body;
  
  try {
    const [result] = await db.promise().query(
      'INSERT INTO leads (restaurant_name, address, contact_number, status, assigned_kam) VALUES (?, ?, ?, ?, ?)',
      [restaurant_name, address, contact_number, status || 'New', assigned_kam]
    );
    
    const [newLead] = await db.promise().query('SELECT * FROM leads WHERE id = ?', [result.insertId]);
    res.status(201).json(newLead[0]);
  } catch (error) {
    console.error('Error creating lead:', error);
    res.status(500).json({ error: 'Failed to create lead' });
  }
});

// Update a lead
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { restaurant_name, address, contact_number, status, assigned_kam } = req.body;
  
  try {
    const [result] = await db.promise().query(
      'UPDATE leads SET restaurant_name = ?, address = ?, contact_number = ?, status = ?, assigned_kam = ? WHERE id = ?',
      [restaurant_name, address, contact_number, status, assigned_kam, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    const [updatedLead] = await db.promise().query('SELECT * FROM leads WHERE id = ?', [id]);
    res.json(updatedLead[0]);
  } catch (error) {
    console.error('Error updating lead:', error);
    res.status(500).json({ error: 'Failed to update lead' });
  }
});

// Delete a lead
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.promise().query('DELETE FROM leads WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Lead not found' });
    }
    
    res.json({ message: 'Lead deleted successfully' });
  } catch (error) {
    console.error('Error deleting lead:', error);
    res.status(500).json({ error: 'Failed to delete lead' });
  }
});


module.exports = router;