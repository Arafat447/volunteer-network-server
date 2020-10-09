const express = require('express');
const bodyParser = require('body-parser');
const cors = require ('cors');
const { ObjectID, ObjectId } = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9a5nl.mongodb.net/volunteer?retryWrites=true&w=majority`;
const app = express();

app.use(cors());
app.use(bodyParser.json())
app.get('/', (req, res) => {
  res.send('Hello World!')
})



const client = new MongoClient(uri, { useNewUrlParser: true ,useUnifiedTopology: true});
client.connect(err => {
  const collection = client.db("volunteer").collection("events");
  app.post('/addVlounteer',(req,res)=>{
      const event= req.body;
      collection.insertOne(event)
      .then(result => {
        res.send(result.insertedCount>0)
      })
  });
  app.get('/getEvents',(req,res)=>{
    collection.find({email : req.query.email})
    .toArray((err,documents)=>{
      res.send(documents)
    })
  });

  app.delete("/deleteEvents/:id",(req,res)=>{
    collection.deleteOne({_id:ObjectId(req.params.id)})
    .then(result =>{
      res.redirect('/getEvents')
    })
  });

  app.get('/getAllUser',(req,res)=>{
    collection.find({})
    .toArray((err,documents)=>{
      res.send(documents);
    })
  });

  app.delete("/removeEvents/:id",(req,res)=>{
    collection.deleteOne({_id:ObjectId(req.params.id)})
    .then(result =>{
      res.redirect('/admin')
    })
  });
 
});


app.listen(process.env.PORT || 4000, () => {
  console.log('listening port 4000')
})