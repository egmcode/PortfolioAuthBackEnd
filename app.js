import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import router from './routes/Router.js';
import cookieParser from 'cookie-parser';

const app = express();

//add middleware
app.use(cors({
    origin: "https://www.egmcodes.com",
    credentials: true
}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use('/', router);

const port = process.env.PORT || 5050;
app.listen(port, () => {
    console.log('listening on 5050');
});