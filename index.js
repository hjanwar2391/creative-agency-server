const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const fileUpload =require("express-fileupload");
const cors = require('cors')
require('dotenv').config()


const uri = "mongodb+srv://anwarkhan:anwarkhan2391@cluster0.ckhne.mongodb.net/agency?retryWrites=true&w=majority";

 //const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS} <@cluster0.ckhne.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()

app.use(bodyParser.json());
app.use(cors());

app.use(fileUpload())

const port = 5000


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true});
client.connect(err => {
  const orderCollection = client.db("agency").collection("order");
  const feedbackCollection = client.db("agency").collection("feedback");
  const adminCollection = client.db("agency").collection("admin");
  const serviceCollection = client.db("agency").collection("service");

    app.post('/addOrder', (req, res) => {
        const appointment = req.body;
        console.log(appointment);
        console.log(appointment);
        orderCollection.insertOne(appointment)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    });

    app.get('/orders', (req, res) => {
        orderCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    app.get('/orderList', (req, res) => {
        orderCollection.find({email: req.query.email})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    app.post('/AddFeedback', (req, res) => {
        const feedbacks = req.body;
        console.log(feedbacks);
        feedbackCollection.insertOne(feedbacks)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    });

    app.get('/feedbackArea', (req, res) => {
        feedbackCollection.find({})
        .toArray((err, documents) => {
            res.send(documents)
        })
    })


    app.post('/addAService', (req, res) => {
        const file = req.files.file;
        const name = req.body.name;
        const description = req.body.description;
        const email = req.body.email;
        const newImg = file.data;
        const encImg = newImg.toString('base64');

        var image = {
            contentType: file.mimetype,
            size: file.size,
            img: Buffer.from(encImg, 'base64')
        };

        serviceCollection.insertOne({ name, email, image, description })
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })

    app.post('/addAdmin', (req, res) => {
        const userInfo = req.body;
        adminCollection.insertOne(userInfo)
          .then(result => {
            res.send(result.insertedCount > 0)
          })
    });

    app.post('/isAdmin', (req, res) => {
        const email = req.body.email;
        adminCollection.find({ email: email })
          .toArray((err, admins) => {
            res.send(admins.length > 0);
          })
    });
      
    app.post('/isUser', (req, res) => {
        const email = req.body.email;
        orderCollection.find({ email: email })
          .toArray((err, user) => {
            res.send(user.length > 0);
          })
    });

   

    app.get('/service', (req, res) => {
        serviceCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    });

  
});



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT || port)