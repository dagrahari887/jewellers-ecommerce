import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import router from './routes';

const app = express();

const PORT = Number(process.env.PORT) || 5000;

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

app.use(express.json());

app.use('/api', router);

app.get('/', (_req, res) => {
  res.json({
    message: 'Baikunthh Jewellers API is running',
  });
});

app.listen(PORT, () => {
  console.log(
    `Baikunthh Jewellers API running on http://localhost:${PORT}`
  );
});