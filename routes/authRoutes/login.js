import jwt from 'jsonwebtoken';
import CustomerModel from '../../model/customer.js';

const Login = async (req, res) => {
    const { name, password } = req.body;
    try {
        const user = await CustomerModel.findOne({ name: name });
        if (user) {
            if (user.password === password) {
                const token = jwt.sign({ userId: user._id }, 'your_secret_key', { expiresIn: '1h' });
                res.json({ success: true, token: token });
            } else {
                res.json({ success: false, message: "Invalid Password" });
            }
        } else {
            res.json({ success: false, message: "User Not Found" });
        }
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export default Login;
