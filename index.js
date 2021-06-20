const express = require('express')
const app = express()
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()
app.use(cors());
app.use(bodyParser.json());

const port = process.env.PORT || 4200;
const ObjectID = require('mongodb').ObjectID;
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mcsxh.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const EmployerCollection = client.db('Career_Designer').collection("Employer_Collection");
  const AllJobsCollection = client.db('Career_Designer').collection("AllJobCollection");
  const AdminsCollection = client.db('Career_Designer').collection("AdminCollection");

//   app.post('/adddata/PopularDrink', (req, res) => {
//     const newProduct = req.body;
//     console.log(newProduct);
//     console.log(req.body, "come from client site")
//     AllJobsCollection.insertOne(newJob)
//       .then(result => {
//         console.log('inserted count', result.insertedCount);
//         res.send(result.insertedCount > 0)
//       })
//   })
  app.post('/adding_a_employer', (req, res) => {
    const newemployer = req.body;
    console.log(newemployer);
    EmployerCollection.insertOne(newemployer)
      .then(result => {
        console.log('inserted count', result.insertedCount);
        console.log(result);
        res.send(result.insertedCount > 0)
      })
  })


  app.get('/userIsEmployer', (req, res) => {
    EmployerCollection.find({ email: req.query.email })
      .toArray((err, documents) => {
          console.log(err)
          console.log(documents)
        res.send(documents);
      })
  });


  app.post('/employer_adding_a_job', (req, res) => {
    const newjob = req.body;
    console.log(newjob);
    AllJobsCollection.insertOne(newjob)
      .then(result => {
        console.log('inserted count', result.insertedCount);
        console.log(result);
        res.send(result.insertedCount > 0)
      })
  })
  app.get('/userIsAdmin', (req, res) => {
    AdminsCollection.find({ email: req.query.email })
      .toArray((err, documents) => {
        res.send(documents);
      })
  });
  app.post('/newAdminMaker', (req, res) => {
    const newAdmin = req.body;
    console.log(req.body, "come from client site")
    AdminsCollection.insertOne(newAdmin)
      .then(result => {
        console.log('inserted count', result.insertedCount);
        res.send(result.insertedCount > 0)
      })
  })


  
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})