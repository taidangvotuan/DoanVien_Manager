import DoanVien from './models/doanvien.js';
import { sequelize } from './database.js';
import { Op } from 'sequelize';

async function queryDoanVien() {
  try {
    // Get all books
    console.log("==== DANH SÁCH ĐOÀN VIÊN ====");
    const DsDoanVien = await DoanVien.findAll();
    DsDoanVien.forEach(dv => {
      console.log(dv.getDetails());
    });

    // Close the database connection
    await sequelize.close();
  } catch (error) {
    console.error('Lỗi truy vấn đoàn viên:', error);
    await sequelize.close();
  }
}

queryDoanVien();
