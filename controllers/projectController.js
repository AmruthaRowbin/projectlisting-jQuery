
const db = require('../config/db');

exports.getProjects = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 2;
  const offset = (page - 1) * limit;
  const sort = req.query.sort || 'recent';

  let sortQuery = 'p.created_at DESC';
  if (sort === 'category') sortQuery = 'c.category_name ASC';
  else if (sort === 'username') sortQuery = 'u.username ASC';
  else if (sort === 'title') sortQuery = 'p.title ASC';

  const query = `
    SELECT p.title, u.username, c.category_name
    FROM projects p
    JOIN users u ON u.user_id = p.user_id
    LEFT JOIN categories c ON c.cid = p.cid
    ORDER BY ${sortQuery}
    LIMIT ? OFFSET ?
  `;

  db.query(query, [limit, offset], (err, rows) => {
    if (err) return res.status(500).json({ error: err });

    db.query('SELECT COUNT(*) AS total FROM projects', (err2, countResult) => {
      if (err2) return res.status(500).json({ error: err2 });
      const total = countResult[0].total;
      res.json({
        projects: rows,
        totalPages: Math.ceil(total / limit),
        currentPage: page
      });
    });
  });
};
