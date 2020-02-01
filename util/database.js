const MongoClient =  require('mongodb').MongoClient;
require('dotenv/config');

let _db;

const mongoConnect = callback => {
  MongoClient.connect(process.env.DB_CONNECTION,{useUnifiedTopology: true})
  .then(client => {
    _db = client.db('shop');  // you can overwrite the database name like client.db('test')
    console.log('Connected');
    callback();
  })
  .catch(err => console.log(err)
  );
  
}

const getDb = () =>{
  
  if(_db){
    return _db;
  } 
  throw 'no db detected';
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;



