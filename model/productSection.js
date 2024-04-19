// productSection.js
import mongoose from "mongoose";
import ProductCategory from './productCategory.js'; // Correct import statement

const productSectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductCategory'
  }]
});

const ProductSection = mongoose.model('ProductSection', productSectionSchema);
export default ProductSection;
