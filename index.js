const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()


const port = process.env.PORT || 5500

app.use(cors())
app.use(bodyParser.json())


app.get('/', (req, res) => {
  res.send('Hello World!')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yquz0.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("dhamakaShopping").collection("products");
  const orderCollection = client.db("dhamakaShopping").collection("order");
 
  app.get('/product' , (req,res) =>{
      collection.find()
      .toArray((err ,items) =>{
          res.send(items)
      })

  })

  app.get('/orders' , (req,res)=>{
    orderCollection.find({email: req.query.email})
    .toArray((err , items)=>{
      res.send(items);
    })
  })

  app.post('/addProduct' , (req,res) =>{
      const newEvent = req.body;
      console.log('adding new event' , newEvent);
      collection.insertOne(newEvent)
      .then(result =>{
          console.log(result.insertedCount)
          res.send(result.insertedCount>0)
      }) 
  }) 

  
  app.post('/orderDetails' , (req,res) =>{
    const orderDetails = req.body;
    console.log('adding new event' ,  orderDetails);
    orderCollection.insertOne(orderDetails)
    .then(result =>{
        console.log(result.insertedCount)
        res.send(result.insertedCount>0)
    }) 
}) 



app.delete('/deleteEvent/:id', (req, res) => {
  collection.findOneAndDelete({_id: ObjectID (req.params.id)})
  console.log({_id: ObjectID (req.params.id)})
  .then( (result) => {
      console.log(result);
  })
  // console.log(req.params.id)
  // console.log(_id)
  // console.log(result)

}) 
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})