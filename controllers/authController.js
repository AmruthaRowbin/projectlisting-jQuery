const crypto = require('crypto');
const db = require('../config/db');



exports.register = (req, res) => {
  const { username, password } = req.body;
  console.log(req.body)

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password are required' });
  }

  // Generate a random salt
  const salt = crypto.randomBytes(8).toString('hex');

  // Hash the password using md5(md5(password) + salt)
  const hashedPassword = crypto.createHash('md5').update(
    crypto.createHash('md5').update(password).digest('hex') + salt
  ).digest('hex');


  const sql = 'INSERT INTO users (username, password, salt) VALUES (?, ?, ?)';

  db.query(sql, [username, hashedPassword, salt], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ success: false, message: 'Username already exists' });
      }
      return res.status(500).json({ success: false, error: err.message });
    }
    res.status(201).json({ success: true, message: 'User registered successfully' });
  });
};



exports.login = (req, res) => {
  const { username, password } = req.body;
  console.log(req.body)
  db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
    if (err || results.length === 0) return res.json({ success: false, message: 'Invalid login' });

    const user = results[0];
    const hashed = crypto.createHash('md5').update(
      crypto.createHash('md5').update(password).digest('hex') + user.salt
    ).digest('hex');

    if (hashed === user.password) {
      req.session.user = { user_id: user.user_id, username: user.username };
      res.json({ success: true });
    } else {
      res.json({ success: false, message: 'Invalid credentials' });
    }
  });
};
