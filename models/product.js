const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

const Product  = class Product{
  constructor(title, price, imageUrl , description, id, userId){
    this.title = title;
    this.price = price;
    this.imageUrl = imageUrl;
    this.description = description;
    this._id = id ? new mongodb.ObjectId(id) : null; //applying ternary operator here if there is id then convert into onjecid and if there is no id then pass null so that it goes throug the else block and create new product rather than  updating the product
    this.userId = userId;
  }
  save(){
    const db = getDb();
    let dbOp;
   
    if(this._id){
     dbOp = db.collection('products').updateOne({_id: this._id}, { $set: this}); //to update we have to provide $set object
    } else {
  dbOp = db.collection('products')
    .insertOne(this)
    }
    return dbOp
    .then(result =>{
      console.log(result); 
    })
    .catch(err => {
      console.log(err);
    })

  }

  static fetchAll(){
    const db = getDb(); 
    return db.collection('products')
    .find().toArray()    //find() is cursor hence we use toArray() here
    .then(products => {
      console.log(products);
      return products;
    })
    .catch(err => {
      console.log(err);
      
    })
  }

  static findById(prodId){
    const db = getDb();
    return db.collection('products')
    .find({_id: new mongodb.ObjectId(prodId)})
    .next()
    .then(product => {
      console.log(product);
      return product; 
    })
    .catch(err => {
      console.log(err);
    })
  }
    static deleteById(prodId){
      const db = getDb();

      return db.collection('products').deleteOne({_id: new mongodb.ObjectId(prodId)})
      .then(products => {
        return products;
      })
      .catch(err => {
        console.log(err)
      })

    }

}

module.exports = Product;
