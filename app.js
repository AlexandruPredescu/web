
const express = require('express');
const app = express();
const logger = require('morgan'); //importing a HTTP logger
const hostname = "127.0.0.1";
const cors = require('cors');
const admin = require("firebase-admin");
//const db = admin.firestore;
const credeatials = require("./key.json");
const port = 3025;

admin.initializeApp({
    credeatials:admin.credential.cert(credeatials)
});


app.use(logger('dev')); //using the HTTP logger library
app.use(cors()) //see more at https://www.npmjs.com/package/cors
app.use(express.urlencoded({ extended: false }))
app.use(express.json()) //we expect JSON data to be sent as payloads


app.get('/', (req, res) => {
    res.send('Hello World!')
  });
  
  app.post('/data', (req, res) => {
    let data = req.body
    console.log('trying to post the following data: ', data)
    res.send('Succes')
  });

app.post('/create', async (req, res) => {
    try {
      console.log(req.body);
      const id = req.body.email;
      const userJson = {
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName
      };
      const usersDb = db.collection('users'); 
      const response = await usersDb.doc(id).set(userJson);
      res.send(response);
    } catch(error) {
      res.send(error);
    }
  });



app.get('/read/:id', async (req, res) => {
    try {
      const userRef = db.collection("users").doc(req.params.id);
      const response = await userRef.get();
      res.send(response.data());
    } catch(error) {
      res.send(error);
    }
  });


  app.post('/update', async(req, res) => {
    try {
      const id=req.body.id;
      const newFirstName = "hello world!";
      const userRef = await db.collection("users").doc(id)
      .update({
        firstName: newFirstName
      });
      res.send(userRef);
    } catch(error) {
      res.send(error);
    }
  });

  app.delete('/delete/:id', async (req, res) => {
    try {
      const response = await db.collection("users").doc(req.params.id).delete();
      res.send(response);
    } catch(error) {
      res.send(error);
    }
  })


  const db = admin.firestore;

// Prints a log once the server starts listening
app.listen(port, hostname, () => {
   console.log(`Server running at http://${hostname}:${port}/`);
})