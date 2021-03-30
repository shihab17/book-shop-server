const express = require('express')
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const port = process.env.PORT || 5055;
app.use(cors());
app.use(bodyParser.json());

const MongoClient = require('mongodb').MongoClient;
console.log(process.env.DB_USER)
app.get('/', (req, res) => {
  res.send('Hello World!')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8zovd.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log("error", err)
  const collection = client.db("bookShop").collection("book");
  // perform actions on the collection object
  console.log("database  connected successfully")
  client.close();
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})