// index.js
import express from 'express';
import cors from 'cors';
import connectDB from './db.js';
import router from './routes/routes.js';
const port = 4000;

import User from './model/customer.js';

const app = express();
app.use(express.json());
app.use(
    cors({
        origin: ["http://localhost:3000"],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);

// Database
connectDB();

// app.use('/home', authMiddleware);

// Routes
app.use('/', router);

app.get('/api/quote', async (req, res) => {
	const token = req.headers['x-access-token']

	try {
		const decoded = jwt.verify(token, 'secret123')
		const email = decoded._id
		const user = await User.findOne({ _id: email })

		return res.json({ status: 'ok', quote: user.quote })
	} catch (error) {
		console.log(error)
		res.json({ status: 'error', error: 'invalid token' })
	}
})

app.post('/api/quote', async (req, res) => {
	const token = req.headers['x-access-token']

	try {
		const decoded = jwt.verify(token, 'secret123')
		const email = decoded._id
		await User.updateOne(
			{ email: email },
			{ $set: { quote: req.body.quote } }
		)

		return res.json({ status: 'ok' })
	} catch (error) {
		console.log(error)
		res.json({ status: 'error', error: 'invalid token' })
	}
})

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
