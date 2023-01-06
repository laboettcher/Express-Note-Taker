// Required packages 
const PORT = process.env.PORT || 3001;
const fs = require('fs');
const path = require('path');

const express = require('express');
const app = express();

// Use to save all notes to db.json file
const allNotes = require('./db/db.json');

// Parse data requests
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Read the db.json file and return all saved notes as JSON
app.get('/api/notes', (req, res) => {
    res.json(allNotes.slice(1));
});

// Return index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

// Return the notes.html file
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

// Return index.html file
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

// Able to create new note and push to db.json file
function createNewNote(body, notesArray) {
    const newNote = body;
    if (!Array.isArray(notesArray))
        notesArray = [];
    
    if (notesArray.length === 0)
        notesArray.push(0);

    body.id = notesArray[0];
    notesArray[0]++;

    notesArray.push(newNote);
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify(notesArray, null, 2)
    );
    return newNote;
}

// Receive a new note to save on the request body and add to db.json file
// Return new note with unique id
app.post('/api/notes', (req, res) => {
    const newNote = createNewNote(req.body, allNotes);
    res.json(newNote);
});

// Read all notes in db.json file and delete notes based on their id
// Rewrite notes to db.json file
function deleteNote(id, notesArray) {
    for (let i = 0; i < notesArray.length; i++) {
        let note = notesArray[i];

        if (note.id == id) {
            notesArray.splice(i, 1);
            fs.writeFileSync(
                path.join(__dirname, './db/db.json'),
                JSON.stringify(notesArray, null, 2)
            );

            break;
        }
    }
}

// Delete notes using query parameter containing the note's id
app.delete('/api/notes/:id', (req, res) => {
    deleteNote(req.params.id, allNotes);
    res.json(true);
});

// Log the port number
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});