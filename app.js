const express = require('express');
const morgan = require('morgan');


// --- App config

const app = express();

// --- Middleware

app.use(morgan('common'));
app.use(express.static('./static/'));

// --- Routes


// ---

module.exports = app;