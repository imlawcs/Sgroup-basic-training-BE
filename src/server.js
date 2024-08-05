const express = require('express');
/*const db = require('./database/db');*/
require('dotenv').config();

const app = express();
const router = require('./routes/user.router.js');
const file = require('./routes/file.route.js');
const vote = require('./routes/vote.route.js');
const port = 3000;

app.use(express.json());
app.use('/', router);
app.use('/', file);
app.use('/', vote);

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
