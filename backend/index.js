import express from 'express';

import pkg from 'body-parser';
const { json, urlencoded } = pkg;
import { sequelize } from './database.js';
import router from './routes/doanvien.js';
// import type  { ErrorRequestHandler } from 'express'; 
// import { Request } from 'express'; 
// import { Response } from 'express';
// import { NextFunction } from 'express';
const app = express();

app.use(json());
app.use(urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

//test route
app.get('/', (req, res) => {
  res.send('Hello World');
});

//CRUD routes
// app.use('/doanvien', require('./routes/doanvien'));
app.use('/doanvien', router);

//error handling
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message: message });
});

//sync database
sequelize
  .sync({ alter: true })
  .then(result => {
    console.log("Database connected");
    app.listen(3000);
  })
  .catch(err => console.log(err));