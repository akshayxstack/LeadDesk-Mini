const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_BUDGETS = ['<5k', '5-10k', '10k+'];

const validateLead = (req, res, next) => {
  const { name, email, budgetRange, message } = req.body || {};

  // Check required fields
  if (name === undefined || name === null || name === '') {
    return res.status(400).json({ error: 'name is required.' });
  }
  if (email === undefined || email === null || email === '') {
    return res.status(400).json({ error: 'email is required.' });
  }
  if (budgetRange === undefined || budgetRange === null || budgetRange === '') {
    return res.status(400).json({ error: 'budgetRange is required.' });
  }
  if (message === undefined || message === null || message === '') {
    return res.status(400).json({ error: 'message is required.' });
  }

  // Type checks
  if (typeof name !== 'string') {
    return res.status(400).json({ error: 'name must be a string.' });
  }
  if (typeof email !== 'string') {
    return res.status(400).json({ error: 'email must be a string.' });
  }
  if (typeof budgetRange !== 'string') {
    return res.status(400).json({ error: 'budgetRange must be a string.' });
  }
  if (typeof message !== 'string') {
    return res.status(400).json({ error: 'message must be a string.' });
  }

  const trimmedName = name.trim();
  const trimmedEmail = email.trim().toLowerCase();
  const trimmedMessage = message.trim();

  if (trimmedName.length < 2 || trimmedName.length > 80) {
    return res.status(400).json({ error: 'Name must be between 2 and 80 characters.' });
  }

  if (!EMAIL_REGEX.test(trimmedEmail)) {
    return res.status(400).json({ error: 'Enter a valid email address.' });
  }

  if (!ALLOWED_BUDGETS.includes(budgetRange)) {
    return res.status(400).json({ error: 'Select a valid budget range.' });
  }

  if (trimmedMessage.length < 10 || trimmedMessage.length > 1000) {
    return res.status(400).json({ error: 'Message must be between 10 and 1000 characters.' });
  }

  req.validatedLead = {
    name: trimmedName,
    email: trimmedEmail,
    budgetRange,
    message: trimmedMessage
  };

  next();
};

module.exports = validateLead;
