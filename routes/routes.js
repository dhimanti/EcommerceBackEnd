import express from 'express';
const router = express.Router();


import Signup from './authRoutes/signup.js';
import Login from './authRoutes/login.js';
import { getProduct, postProduct, deleteProductByProductId, getProductCategoryWise, getAllProduct, getAllCategory } from './productRoutes/productRoutes.js';
import { postWishListData, deleteWishListData, getWishListData } from './productRoutes/wishListRoutes.js';

router.post('/register', Signup);
router.post('/login', Login);
router.get('/product/:productId', getProduct);
router.post('/product', postProduct);
router.delete('/products/:id', deleteProductByProductId );
router.get('/products/:categoryId', getProductCategoryWise);
router.get('/allProducts', getAllProduct);
router.get('/allCategory', getAllCategory);
router.post('/wishlist/addProduct/', postWishListData);
router.delete('/wishlist/removeProduct', deleteWishListData);
router.get('/wishlist/showProduct/:userId', getWishListData );


export default router;