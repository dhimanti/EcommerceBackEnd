// product.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  SKUs: {
    type: Number,
    required: true
  },
  image: {
    type : String,
    required : true
  },
  discount: {
    type:String
  },
  rating: {
    type: Number,
    min: 0, // Minimum rating value
    max: 5, // Maximum rating value
    default: 0
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductCategory'
  },
  section: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductSection'
  }
});

// Add middleware for cascading delete
productSchema.pre('remove', async function(next) {
  const product = this;
  
  // Remove product reference from the corresponding category
  await mongoose.model('ProductCategory').updateMany({}, { $pull: { products: product._id } });
  
  // Remove product reference from the corresponding section
  await mongoose.model('ProductSection').updateMany({}, { $pull: { categories: product.category } });

  next();
});

const Product = mongoose.model('Product', productSchema);
export default Product;
