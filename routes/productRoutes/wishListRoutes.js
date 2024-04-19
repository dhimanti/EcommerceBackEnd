import UserWishList from '../../model/userWishListSchema.js';
import Product from '../../model/product.js';
import User from '../../model/customer.js';

const postWishListData = async (req, res) => {
    try {
        const { productId, userId } = req.body;

        const existingUser = await User.findById(userId);
        if (!existingUser) {
            return res.status(404).json({ error: 'User not found', userId });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found', productId });
        }

        let userWishlist = await UserWishList.findOneAndUpdate(
            { user: userId },
            { $addToSet: { products: productId } },
            { new: true, upsert: true }
        );

        res.json(userWishlist);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


const deleteWishListData = async (req, res) => {
    try {
        const { productId, userId } = req.body;

        const existingUser = await User.findById(userId);
        if (!existingUser) {
            return res.status(404).json({ error: 'User not found', userId });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found', productId });
        }

        let userWishlist = await UserWishList.findOneAndUpdate(
            { user: userId },
            { $pull: { products: productId } },
            { new: true }
        );
        console.log(userWishlist);
        res.json({ message: "Product deleted successfully" });

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

const getWishListData = async(req, res) => {
    try{
        // const userId = req.body.userId;
        const userId = req.params.userId;
        const existingUser = await User.findById(userId);
        if (!existingUser) {
            return res.status(404).json({ error: 'User not found', userId });
        }
        const products = await UserWishList.find({user : userId}).select('products');

        if(products.length === 0) {
            return res.json({message : "No Product in Wishlist!"});
        }
        res.json({message : "Here is your WishList" , products})
    } catch(err){
        res.status(400).json({ error: err.message });
    }
}


export { postWishListData, deleteWishListData, getWishListData };