// productRoutes.js
import Product from '../../model/product.js';
import ProductCategory from '../../model/productCategory.js';
import ProductSection from '../../model/productSection.js';
import mongoose from 'mongoose';

const getProduct = async (req, res) => {
    try{
        const productId = req.params.productId;
        let product = await Product.find({_id : productId});
        if(!product) {
            return res.status(404).json({error:"Product Not Found", product});
        }
        console.log(product);
        res.json({product, message:"Product found successfully"});
    } catch(err) {
        res.status(400).json({ error: err.message });
    }
}


const postProduct = async (req, res) => {
    try {
        const { category: categoryName, section: sectionName, ...productData } = req.body;

        let category = await ProductCategory.findOne({ name: categoryName });
        if (!category) {
            category = await ProductCategory.create({ name: categoryName });
        }

        let section = await ProductSection.findOne({ name: sectionName });
        if (!section) {
            section = await ProductSection.create({ name: sectionName });
        }

        const product = await Product.create({ ...productData, category: category._id, section: section._id });

        // Update the corresponding category document
        await ProductCategory.findByIdAndUpdate(category._id, {
            $push: { products: product._id }
        });

        // Update the corresponding section document
        await ProductSection.findByIdAndUpdate(section._id, {
            $push: { categories: category._id }
        });

        res.json(product);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const deleteProductByProductId = async (req, res) => {
    try {
        const productId = req.params.id;
        
        if(!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ error: "Invalid product Id" });
        }

        // Delete the product
        const deletedProduct = await Product.deleteOne({ _id: productId });
        
        if (deletedProduct.deletedCount === 0) {
            return res.status(404).json({ error: "Product not found" });
        }
        
        // Also, remove product reference from the corresponding category and section documents
        await ProductCategory.updateMany({}, { $pull: { products: productId } });
        await ProductSection.updateMany({}, { $pull: { categories: { $in: [productId] } } });

        res.json({ message: "Product deleted successfully" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const getProductCategoryWise = async(req,res) => {
    try{
        const categoryId = req.params.categoryId;

        if(!mongoose.Types.ObjectId.isValid(categoryId)) {
            return res.status(400).json({ error: "Invalid category Id" });
        }
        
        const products = await Product.find({category: categoryId});
        
        if(products.length === 0) {
            return res.status(404).json({error: "No products found for the given category ID" });
        }
        res.json({ message: "Product found successfully", products})
    } catch(err) {
        res.status(400).json({error: err.message});
    }
}

const getAllProduct= async(req, res) => {
    try{
        const products = await Product.find();
        if(products.length === 0) {
            return res.status(404).json({error: "No products available"});
        }

        res.json({message: "Products found Successfully", products});
    } catch(err) {
        res.status(400).jon({error: err.message});
    }
}

const getAllCategory= async(req, res) => {
    try{
        const category = await ProductCategory.find().select('_id name');
        if(category.length === 0) {
            return res.status(404).json({error: "No products available"});
        }

        res.json({category});
    } catch(err) {
        res.status(400).jon({error: err.message});
    }
}



export { getProduct, postProduct, deleteProductByProductId, getProductCategoryWise, getAllProduct, getAllCategory };
