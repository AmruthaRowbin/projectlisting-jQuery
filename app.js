const express = require('express');
const session = require('express-session');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(session({
  secret: 'your_secret',
  resave: false,
  saveUninitialized: true
}));

app.use('/api', require('./routes/authRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));

app.listen(3000, () => {
  console.log(' Server running at http://localhost:3000');
});
