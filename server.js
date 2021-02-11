// Import modules
const fs = require('fs');
const path = require('path');
const express = require('express');

// Init Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware - Helps parse data
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ROUTE (HTML): /notes
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/notes.html'));
});

// ROUTE (HTML): index/root/*
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Start listening
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});