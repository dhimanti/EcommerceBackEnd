// productCategory.js
import mongoose from "mongoose";
import Product from './product.js';
import User from './customer.js';


const UserWishCartSchema = new mongoose.Schema({
  user: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    unique: true
  }],
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }]
});

export default mongoose.model('UserWishCart', UserWishCartSchema);
