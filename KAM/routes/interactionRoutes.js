const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get pending calls - This should come before the /lead/:leadId route
router.get('/pending', async (req, res) => {
    try {
        const { leads } = req.query;
        let query = `
            SELECT i.*, l.restaurant_name 
            FROM interactions i
            JOIN leads l ON i.lead_id = l.id
            WHERE i.interaction_type = 'Call'
            AND DATE(i.interaction_date) = CURDATE()
        `;
        
        // Add lead filtering if leads parameter is present
        if (leads) {
            const leadIds = leads.split(',');
            query += ` AND i.lead_id IN (${leadIds.map(() => '?').join(',')})`;
        }
        
        query += ' ORDER BY i.interaction_date ASC';
        
        const [interactions] = await db.promise().query(
            query,
            leads ? leads.split(',') : []
        );
        
        res.json(interactions);
    } catch (error) {
        console.error('Error fetching pending calls:', error);
        res.status(500).json({ error: 'Failed to fetch pending calls' });
    }
});

// Get recent interactions - This should also come before the /lead/:leadId route
router.get('/recent', async (req, res) => {
    try {
        const { leads } = req.query;
        let query = `
            SELECT i.*, l.restaurant_name 
            FROM interactions i
            JOIN leads l ON i.lead_id = l.id
        `;
        
        // Add lead filtering if leads parameter is present
        if (leads) {
            const leadIds = leads.split(',');
            query += ` WHERE i.lead_id IN (${leadIds.map(() => '?').join(',')})`;
        }
        
        query += ' ORDER BY i.created_at DESC LIMIT 10';
        
        const [interactions] = await db.promise().query(
            query,
            leads ? leads.split(',') : []
        );
        
        res.json(interactions);
    } catch (error) {
        console.error('Error fetching recent interactions:', error);
        res.status(500).json({ error: 'Failed to fetch recent interactions' });
    }
});

// Get all interactions for a lead
router.get('/lead/:leadId', async (req, res) => {
    try {
        const [interactions] = await db.promise().query(
            'SELECT * FROM interactions WHERE lead_id = ?', 
            [req.params.leadId]
        );
        res.json(interactions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add a new interaction
router.post('/', async (req, res) => {
    const { lead_id, interaction_date, interaction_type, notes, follow_up_required } = req.body;
    try {
        const [result] = await db.promise().query(
            'INSERT INTO interactions (lead_id, interaction_date, interaction_type, notes, follow_up_required) VALUES (?, ?, ?, ?, ?)',
            [lead_id, interaction_date, interaction_type, notes, follow_up_required]
        );
        res.status(201).json({ id: result.insertId, ...req.body });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;