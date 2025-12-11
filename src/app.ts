import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import router from './app/routes';

const app: Application = express();
app.use(cors({
    origin: 'http://localhost:5000',
    credentials: true
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', router);


app.get('/', (req: Request, res: Response) => {
    res.send({
        Message: "Server is running..."
    })
});


export default app;