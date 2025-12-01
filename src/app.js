import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from './routes/user.routes.js';

const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
  methods: ['GET','POST','PUT','DELETE'],
  allowedHeaders: ['Content-Type','Authorization']
}));




// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookies
app.use(cookieParser());

// Serve static files (for sw.js)
app.use(express.static('public'));

// Routes
app.use("/api/v1", router);

export { app };


