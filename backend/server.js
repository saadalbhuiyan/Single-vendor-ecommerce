import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';

dotenv.config();


const app = express();

import { connectDB } from './config/db.js';

app.use(cors());
app.use(helmet());
app.use(express.json());

const PORT = process.env.PORT || 5000;

connectDB();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
