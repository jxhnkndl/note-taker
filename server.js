// Import modules
const fs = require('fs');
const path = require('path');
const express = require('express');
const shortid = require('shortid');

// Init Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware: Serve front-end 'public' directory to client statically
app.use(express.static(path.join(__dirname, 'public')));

// Middleware: Assist in parsing data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// GET ROUTE (API): Get all notes from database as JSON
app.get('/api/notes', (req, res) => {
  // Read out saved notes from db.json and return to client as JSON
  const data = fs.readFileSync('db/db.json', 'utf-8');
  const savedNotes = JSON.parse(data);
  res.status(200).json(savedNotes);
});

// POST ROUTE (API): Save note to database
app.post('/api/notes', (req, res) => {
  // Extract the new note from the request and generate a unique id
  const newNote = req.body;

  // Use shortid package to generate a new alphanumeric id property
  newNote.id = shortid.generate();

  // Read existing notes out of db.json
  fs.readFile('db/db.json', (err, data) => {
    if (err) throw err;

    // Parse data extracting from db.json
    let savedNotes = JSON.parse(data);
    // Add saved note to array of notes extracted from db.json
    savedNotes.push(newNote);
    // Format saved notes to write back into db.json
    let updatedNotes = JSON.stringify(savedNotes, null, 2);

    // Re-write saved notes back into db.json
    fs.writeFile('db/db.json', updatedNotes, (err) => {
      if (err) throw err;

      // Respond to the original request with the newly saved note
      res.status(201).json(newNote);
    });
  });
});

// DELETE ROUTE (API): Delete note from database
app.delete('/api/notes/:id', (req, res) => {
  // Extract the target note's id from the req object
  const id = req.params.id;

  // Read existing notes out of db.json
  fs.readFile('db/db.json', (err, data) => {
    if (err) throw err;

    // Parse data extracting from db.json
    let savedNotes = JSON.parse(data);
    
    // Loop through saved notes, remove the target note, respond to client
    savedNotes.forEach((note, index) => {
      if (note.id === id) {
        savedNotes.splice(index, 1);
        console.log('Resource deleted.');
        res.status(204).json({ deleted: true });
      }
    });

    // Format the updated notes to write back into db.json
    let updatedNotes = JSON.stringify(savedNotes, null, 2);

    // Re-write notes back into db.json
    fs.writeFile('db/db.json', updatedNotes, (err) => {
      if (err) throw err;
      console.log('Database successfully updated.');
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