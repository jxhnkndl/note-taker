// Import modules
const fs = require('fs');
const express = require('express');

// Init Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware - Helps parse data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());





// Start listening
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});