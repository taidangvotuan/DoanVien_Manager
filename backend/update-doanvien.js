import DoanVien from './models/doanvien.js';
import { sequelize } from './database.js';
import { Op } from 'sequelize';

async function updateDoanVien() {
  try {
    // Find a book to update
    console.log("=== Trước khi cập nhật ===");
    const dv = await DoanVien.findOne({
      where: {
        SoHieuQN: req.params.doanvienId
      }
    });

    if (dv) {
      console.log(`${dv.SoHieuQN} có họ và tên hiện tại là: $${dv.HoTen}`);

      // Cap nhat ten
      dv.HoTen = 'XYZ';

      // Luu thay doi
      await dv.save();

      console.log("=== Sau khi cập nhật ===");
      console.log(`${dv.SoHieuQN} có họ và tên mới là: $${dv.HoTen}`);
    }

    // Close the database connection
    await sequelize.close();
  } catch (error) {
    console.error('Lỗi cập nhật đoàn viên: ', error);
    await sequelize.close();
  }
}

updateDoanVien();
