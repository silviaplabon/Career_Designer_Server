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
    const JobSeekersCollection=client.db('Career_Designer').collection("JobSeekerCollection")


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

    app.get('/allJobList', (req, res) => {
        AllJobsCollection.find({}).toArray((err, documents) => {
            console.log(err)
            // console.log(documents)
            res.send(documents);
        })
    });

    app.get('/searchJobData/:category/:title/:address', (req, res) => {
        const name = req.params.title;
        const address = req.params.address;
        const area = req.params.category;
        console.log(name, address, area);
        
        AllJobsCollection.find({
            $and: [
                { $or: [ {"category":area } ] },
                { $or: [ {"location":address },{ "title":name } ] }
            ]
        })
            .toArray((err, products) => {
                // console.log(products, "silvia")
                res.send(products)
            })
    })
    app.get('/filterJobData/:category/:title/:address', (req, res) => {
        const name = req.params.title;
        const address = req.params.address;
        const area = req.params.category;
        console.log(name, address, area);
        AllJobsCollection.find({ category: { $ne: area } })
            .toArray((err, filterjob) => {
                console.log(filterjob?.length, "silvia")
                res.send(filterjob)
            })
    })
    app.post('/adding_a_job_seeker_profile', (req, res) => {
        const newProfile = req.body;
        console.log(newProfile);
        JobSeekersCollection.insertOne(newProfile)
            .then(result => {
                console.log('inserted count', result.insertedCount);
                console.log(result);
                res.send(result.insertedCount > 0)
            })
    })

    app.get('/all_candidator_collection', (req, res) => {
        JobSeekersCollection.find({})
            .toArray((err, documents) => {
                console.log(err)
                console.log(documents)
                res.send(documents);
            })
    });






});
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})