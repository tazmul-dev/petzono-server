
const express = require('express')
const app = express()
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000


app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://petzono:qB7A6AINWZv8FE1n@cluster0.yj62d4d.mongodb.net/?appName=Cluster0`

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const run = async () =>{
  try{
    await client.connect();

    const db = client.db('petzone')
    const petCollection = db.collection('pets')



    app.get('/pets', async (req, res)=>{
      const search = req.query.search;
      let query ={};

      if(search){
        query={
           petName: {
            $regex: search,
            $options: "i",
          }
        }
      }
      const result = await petCollection.find(query).toArray()
       res.send(result)
    })
    app.get('/pets/:id', async(req, res)=>{
      const id = req.params.id
      console.log(id)
      const query = {
        _id: new ObjectId(id)
      }
      const petId = await petCollection.findOne(query)
      // console.log(petId)
      res.send(petId)
    })

    app.post('/pets', async (req, res)=>{
      const allPet = req.body
      console.log(allPet)
      const result = await petCollection.insertOne(allPet)
      res.send(result)
    })

    app.get('/myListing/:email', async(req, res)=>{
      const cursor = petCollection.find({ownerEmail:req.params.email})
      const result = await cursor.toArray()
      res.send(result)
    })


    await client.db('admin').command({ping:1});
     console.log("Pinged your deployment. You successfully connected to MongoDB!");

  }
  finally{

  }
}

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port ,()=>{
 console.log(`Example app listening on port ${port}`)
})

run().catch(console.log);