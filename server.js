//allows application to work
const express = require('express');
const path = require('path');
const fs = require('fs');
//generate random id
const { v4: uuidv4 } = require('uuid');
const app = express();
const PORT = process.env.PORT || 3001;

//making public acceptable in all ports
app.use(express.static('public'));

//middleware
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

//notes should return the notes.html file.
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/notes.html'));
});

//req is the request, while res is the response

app.get('/api/notes', (req, res) => {
  //reads in the file
  fs.readFile('./db/db.json', (err, result) => {
    //handles errors
    if (err) {
      console.log(err);
      //result
    } else {
      res.send(result);
    }
  })
})


app.post('/api/notes', (req, res) => {
  //hold db.json content
  var list = [];

  var data = req.body;
  data.id = uuidv4();
  //reads previous data
  fs.readFile('./db/db.json', (err, result) => {
    //error handling
    if (err) {
      console.log(err);
      //returns results
    } else {
      list = JSON.parse(result);
      list.push(data);
      //Writing to the db,json file
      fs.writeFile('./db/db.json', JSON.stringify(list), (err) => {
        if (err) {
          console.log(err);
          //sending the data back
        } else {
          res.json(data);
        }
      })
    }
  })
})

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);
