// Imports required library
const express = require('express')
const path = require('path');
const app = express();
const fs = require('fs');

// helper function to generate unique id
const uuid = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  };

// port that runs the app on local server and heroku
const PORT = process.env.PORT || 3001;

// sets up express for data parsing
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// gets homescreen page and auxillary page
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/notes', (req, res) => 
res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/api/notes', (req, res) => {

    fs.readFile('db/db.json', 'utf-8', (err, data) => {
        err ? console.log(err): res.json(JSON.parse(data))
    })
});

// allows posting of JSON data to server from front end
app.post('/api/notes', (req, res) =>{

    const newNote = req.body
    newNote.id = uuid()

    fs.readFile('db/db.json', 'utf8', (err, data) => {
        const notesJson = JSON.parse(data)
        notesJson.push(newNote)
        fs.writeFile('db/db.json', JSON.stringify(notesJson), (err) => {
            err ? console.log(err): console.log(newNote.title + ' has been created')
        })
        res.sendFile(path.join(__dirname, '/public/notes.html' ))
    }) 
  })

// allows for deleting of JSON data from server using front end UI
app.delete('/api/notes/:id', (req, res) => {
    const storedNote = JSON.parse(fs.readFileSync('db/db.json'))
    const deleteNote = storedNote.find(note => note.id === req.params.id)
    if (deleteNote) {
        const modifiedNote = storedNote.filter(note => note.id !== req.params.id)
        fs.writeFileSync('db/db.json', JSON.stringify(modifiedNote))
        res.status(200).json(deleteNote)
        console.log(deleteNote.title + ' has been deleted')
    } else{
        res.status(404)
    }
})

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
