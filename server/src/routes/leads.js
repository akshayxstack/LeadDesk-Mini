const express = require('express');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const Lead = require('../models/Lead');
const requireAuth = require('../middleware/requireAuth');
const validateLead = require('../middleware/validateLead');

const router = express.Router();

// Rate limiter: Max 5 lead submissions per IP per 10 minutes
const leadSubmissionLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({ error: 'Too many lead submissions from this IP. Please try again later.' });
  }
});

// POST /api/leads - public
router.post('/', leadSubmissionLimiter, validateLead, async (req, res) => {
  try {
    const newLead = new Lead(req.validatedLead);
    await newLead.save();

    return res.status(201).json({
      id: newLead._id.toString(),
      status: newLead.status,
      createdAt: newLead.createdAt.toISOString()
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to save lead submission.' });
  }
});

// GET /api/leads - requires auth
router.get('/', requireAuth, async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search && typeof search === 'string' && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      query = {
        $or: [{ name: searchRegex }, { email: searchRegex }]
      };
    }

    const leads = await Lead.find(query).sort({ createdAt: -1 });

    const formattedLeads = leads.map(lead => ({
      id: lead._id.toString(),
      name: lead.name,
      email: lead.email,
      budgetRange: lead.budgetRange,
      message: lead.message,
      status: lead.status,
      createdAt: lead.createdAt.toISOString()
    }));

    return res.status(200).json({ leads: formattedLeads });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch leads.' });
  }
});

// PATCH /api/leads/:id/status - requires auth
router.patch('/:id/status', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body || {};

    const ALLOWED_STATUSES = ['New', 'Contacted', 'Closed'];
    if (!status || !ALLOWED_STATUSES.includes(status)) {
      return res.status(400).json({ error: 'Status must be New, Contacted, or Closed.' });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: 'Lead not found.' });
    }

    const updatedLead = await Lead.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedLead) {
      return res.status(404).json({ error: 'Lead not found.' });
    }

    return res.status(200).json({
      id: updatedLead._id.toString(),
      status: updatedLead.status
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update lead status.' });
  }
});

module.exports = router;
