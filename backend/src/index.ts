import { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import express from 'express';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import multer from 'multer';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import candidatesRouter from './routes/candidates';



const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Sistema ATS',
      version: '1.0.0',
      description: 'Esta es una API para gestionar candidatos en un sistema ATS',
    },
    servers: [
      {
        url: 'http://localhost:3010',
      },
    ],
  },
  apis: ['./src/routes/*.ts'], // path where API documentation comments are written
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);


dotenv.config();
const prisma = new PrismaClient();

export const app = express();
export default prisma;

const port = 3010;

app.use(cors());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/candidates', candidatesRouter);

app.use('/uploads', express.static('uploads'));

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.type('text/plain'); 
  res.status(500).send('Something broke!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

