const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

class User {
  constructor(username, email, cart, id){
    this.name = username;
    this.email = email;
    this.cart = cart; // {items:[product]}
    this._id = id;
  }
  save(){
    const db = getDb();
   return db.collection('users').insertOne(this);
}

addToCart(product){
const cartProductIndex = this.cart.items.findIndex(cp => {
  return cp.productId.toString() === product._id.toString(); // here we use to == for comparison as one id is js which is string and another id is mongodb onjectid hence we should not compare their type and only should compare the string
});  //it return -1 if not found and return 1 if found


let newQuantity = 1;
const updatedCartItems = [...this.cart.items];

if(cartProductIndex >= 0){  //if the product is already existed and doesnot return -1 in above comparison
  const updatedQuantity= this.cart.items[cartProductIndex].quantity + 1;
  updatedCartItems[cartProductIndex].quantity = updatedQuantity;
}else {
  updatedCartItems.push(
    {productId: new mongodb.ObjectID(product._id), 
      quantity: newQuantity }
      )
};

const updatedCart = {
  items:updatedCartItems
}

//const updatedCart = {items :[{productId: new mongodb.ObjectID(product._id), quantity: 1 }]  } 
const db = getDb();
return db.collection('users').updateOne(
  { _id: new mongodb.ObjectID(this._id) },
  { $set: {cart: updatedCart} }
  )

};


getCart(){
  let db = getDb();
  const productIds = this.cart.items.map(i => {
    return i.productId;
  });

  return db.collection('products')
  .find({_id: {$in: productIds}}).toArray()
  .then(products =>{
    return products.map(p =>{
      return {
        ...p, quantity: this.cart.items.find( cp =>{
         return cp.productId.toString() === p._id.toString();
        }).quantity
      };
    })
  })
  .catch(err => {
    console.log(err); 
  })
}

  
  static findById(userId){
    const db = getDb();
   return db.collection('users').findOne({_id: new mongodb.ObjectId(userId)}) 
  }
}

module.exports = User;