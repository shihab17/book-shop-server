const express = require('express')
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const port = process.env.PORT || 5055;
app.use(cors());
app.use(bodyParser.json());

const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
console.log(process.env.DB_USER)
app.get('/', (req, res) => {
  res.send('Hello World!')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8zovd.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  console.log("error", err)
  const bookCollection = client.db("bookShop").collection("book");
  const cartCollection = client.db("bookShop").collection("cart");
  const orderCollection = client.db("bookShop").collection("orders");
  // perform actions on the collection object
  app.get('/books', (req, res) => {
    bookCollection.find()
      .toArray((err, books) => {
        res.send(books)
      })
  })

  app.get('/book/:bookId', (req, res) => {
    const bookId = ObjectID(req.params.bookId)
    console.log(bookId)
    bookCollection.find({ _id: bookId })
      .toArray((err, book) => {
        res.send(book)
      })
  })

  app.delete('/deleteBook/:bookId', (req, res) => {
    const bookId = ObjectID(req.params.bookId)
    console.log("delete this", bookId)
    bookCollection.findOneAndDelete({ _id: bookId })
      .then(documents => res.send(!!documents.value))
  })

  app.post('/addBook', (req, res) => {
    const newBook = req.body;
    console.log('adding new book ', newBook)
    bookCollection.insertOne(newBook)
      .then(result => {
        console.log('inserted count', result.insertedCount)
        res.send(result.insertedCount > 0)
      })
  })

  app.post('/addCart', (req, res) => {
    const newCart = req.body;
    console.log('adding new cart', newCart)
    cartCollection.insertOne(newCart)
      .then(result => {
        console.log('inserted count', result.insertedCount)
        res.send(result.insertedCount > 0)
      })
  })
  app.get('/cart/:email', (req, res) => {
    cartCollection.find({ "email": req.params.email })
      .toArray((err, cart) => {
        res.send(cart)
      })
  })

  app.delete('/deleteCart/:email', (req, res) => {
    const email = req.params.email;
    cartCollection.deleteMany({ "email": email })
      .then(result => {
        console.log(result)
        res.send(result)
      })

  })
  app.post('/addOrder', (req, res) => {
    const newOrder = req.body;
    console.log("new order", newOrder)
    orderCollection.insertOne(newOrder)
      .then(result => {
        console.log('inserted count', result.insertedCount)
        res.send(result.insertedCount > 0)
      })
  })

  app.get('/orders/:email', (req, res) => {
    const email = req.params.email;
    orderCollection.find({ "email": email })
      .toArray((err, orders) => {
        res.send(orders)
      })
  })

  // client.close();
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})