// A typical Express webservice. All JSON, all the time. Logging with Morgan.

import express from 'express';
import logger from 'morgan';
import { json, urlencoded } from 'body-parser';
import { sequelize, testConnection } from './database.js';
import DoanVien from './models/doanvien.js';

const app = express();

app.use(logger('dev'));
app.use(json());
app.use(urlencoded({ extended: false }));

// Các route đặt TRƯỚC catch-all
app.get('/doanvien', async (req, res, next) => {
  try {
    const dsDoanVien = await DoanVien.findAll();
    res.json(dsDoanVien);
  } catch (error) {
    next(error);
  }
});

app.get('/doanvien/:id', async (req, res, next) => {
  try {
    const doanVien = await DoanVien.findByPk(req.params.id);
    if (!doanVien) {
      return res.status(404).json({ message: 'Không tìm thấy đoàn viên!' });
    }
    res.json(doanVien);
  } catch (error) {
    next(error);
  }
});

// A catch-all route for anything the webservice does not define.
app.get('*', (req, res) => res.status(404).send({
  message: 'Nothing to see here',
}));

export default app;