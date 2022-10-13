const express = require('express')
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3001;
const notesDb = require('./db/db.json')

app.use(express.static('public'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/notes', (req, res) => 
res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/api/notes', (req, res) => 
res.json(notesDb)
);

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));

