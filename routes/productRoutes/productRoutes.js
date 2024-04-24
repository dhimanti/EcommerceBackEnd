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
        res.status(200).json({product, message:"Product found successfully"});
    } catch(err) {
        res.status(400).json({ error: err.message });
    }
}

const postProduct = async (req, res) => {
    try {
        const { category: categoryName, categoryTitle, section: sectionName, ...productData } = req.body;

        let category = await ProductCategory.findOne({ name: categoryName, title: categoryTitle });
        if (!category) {
            category = await ProductCategory.create({ name: categoryName, title: categoryTitle });
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

        // Update the corresponding section document if category is unique
        const categoryData = await ProductSection.findOne({ categories: category._id });
        if (!categoryData) {
            await ProductSection.findByIdAndUpdate(section._id, {
                $push: { categories: category._id }
            });
        }

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
        res.status(400).json({error: err.message});
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
        res.status(400).json({error: err.message});
    }
}

const putCategory = async (req, res) => {
    try {
        const { categoryId, categoryName, categoryTitle, categoryImage } = req.body;

        // Construct the updated category object
        const updatedCategory = {
            name: categoryName,
            title: categoryTitle,
            image: categoryImage
        };

        const category = await ProductCategory.findOneAndUpdate(
            { _id: categoryId },
            updatedCategory,
            { new: true }
        );

        // If category is null, it means the category with the given _id wasn't found
        if (!category) {
            return res.status(404).json({ error: "Category not found" });
        }

        // Return success message and the updated category
        res.json({ message: "Category updated successfully", category });
    } catch (err) {
        // Handle any errors
        res.status(400).json({ error: err.message });
    }
};


const getAllSection = async(req, res) => {
    try{
        const sections = await ProductSection.find();
        if(sections.length === 0) {
            return res.status(404).json({error: "No products available"});
        }

        res.status(200).json({ sections });
    } catch(err) {
        res.status(400).json({error: err.message});
    }
}


const getCategoryBySection = async (req, res) => {
    try {
        const sectionName = req.params.sectionName;
        if (!sectionName) {
            return res.status(400).json({ error: "Section name is required" });
        }
        const section = await ProductSection.findOne({ name: sectionName });

        if (!section) {
            return res.status(404).json({ error: "Section not found" });
        }

        const categories = section.categories;

        if (categories.length === 0) {
            return res.status(404).json({ error: "No categories found for the specified section" });
        }

        const uniqueCategoryIds = new Set();

        categories.forEach(categoryId => uniqueCategoryIds.add(categoryId.toString()));

        // console.log(uniqueCategoryIds);
        const categoryPromises = Array.from(uniqueCategoryIds).map(categoryId => {
            // console.log("Fetching category with ID:", categoryId);
            return ProductCategory.findById(categoryId).select('_id name title image');
        });

        // Wait for all promises to resolve
        const categoryData = await Promise.all(categoryPromises);
        const validCategories = categoryData.filter(category => category !== null);

        console.log("Category data:", validCategories);
        res.status(200).json({ data: validCategories });
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export { getProduct, postProduct, deleteProductByProductId, getProductCategoryWise, getAllProduct, getAllCategory, getAllSection, putCategory, getCategoryBySection };
