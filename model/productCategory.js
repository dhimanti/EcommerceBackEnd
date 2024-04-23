// productCategory.js
import mongoose from "mongoose";
import Product from './product.js'; // Correct import statement

const productCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  image: {
    type : String,
    required : true
  },
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }]
});

const ProductCategory = mongoose.model('ProductCategory', productCategorySchema);
export default ProductCategory;
