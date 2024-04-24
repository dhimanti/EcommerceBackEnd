import express from 'express';
const router = express.Router();


import Signup from './authRoutes/signup.js';
import Login from './authRoutes/login.js';
import { getProduct, postProduct, deleteProductByProductId, getProductCategoryWise, getAllProduct, getAllCategory, getAllSection, putCategory, getCategoryBySection } from './productRoutes/productRoutes.js';
import { postWishListData, deleteWishListData, getWishListData } from './productRoutes/wishListRoutes.js';

router.post('/register', Signup);
router.post('/login', Login);
router.get('/product/:productId', getProduct);
router.post('/product', postProduct);
router.delete('/products/:id', deleteProductByProductId );
router.get('/products/:categoryId', getProductCategoryWise);
router.get('/allProducts', getAllProduct);
router.get('/allCategory', getAllCategory);
router.get('/allSection', getAllSection);
router.post('/wishlist/addProduct/', postWishListData);
router.delete('/wishlist/removeProduct', deleteWishListData);
router.get('/wishlist/showProduct/:userId', getWishListData );

router.put('/updateCategory', putCategory);
router.get('/categoryBySection/:sectionName', getCategoryBySection);



export default router;