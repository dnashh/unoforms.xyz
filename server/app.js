import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import router from './src/routes/index.js';
import { handler } from "./src/build/handler.js";
import errorHandler from './src/utils/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set('views', `${__dirname}/src/views`);
app.set('view engine', 'ejs');

app.use(express.static('src/static'));
app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(router);
app.use(handler);

app.use(errorHandler);

export default app;