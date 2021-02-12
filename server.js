// Import modules
const fs = require('fs');
const path = require('path');
const express = require('express');
const shortid = require('shortid');

// Init Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware - Helps parse data
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ROUTE (API): Get all notes
app.get('/api/notes', (req, res) => {
  // Read out saved notes from db.json and return to client as JSON
  const data = fs.readFileSync('db/db.json', 'utf-8');
  const savedNotes = JSON.parse(data);
  res.json(savedNotes);
});

// ROUTE (API): Save note with auto-generated id
app.post('/api/notes', (req, res) => {
  // Extract the new note from the request and generate a unique id
  const newNote = req.body;
  newNote.id = shortid.generate();

  // Read existing notes out of db.json
  fs.readFile('db/db.json', (err, data) => {
    if (err) throw err;

    // Add the new note to the batch of saved notes
    let savedNotes = JSON.parse(data);
    savedNotes.push(newNote);
    let updatedNotes = JSON.stringify(savedNotes, null, 2);

    // Re-write db.json including the newly saved note
    fs.writeFile('db/db.json', updatedNotes, (err) => {
      if (err) throw err;

      // Respond to the original request with the newly saved note
      res.json(newNote);
    });
  });
});

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
