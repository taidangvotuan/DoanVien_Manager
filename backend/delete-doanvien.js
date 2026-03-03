import DoanVien from './models/doanvien.js';
import { sequelize } from './database.js';
import { Op } from 'sequelize';

async function deleteDoanVien() {
  try {
    // Count DoanVien before deletion
    // const countBefore = await DoanVien.count();
    // console.log(`Tổng số đoàn viên trước khi xóa: ${countBefore}`);

    // Find and delete a DoanVien by instance method
    const DoanVienToDelete = await DoanVien.findOne({
      where: {
        SoHieuQN: req.params.doanvienId
      }
    });

    if (DoanVienToDelete) {
      console.log(`Tìm thấy đoàn viên để xóa: ${DoanVienToDelete.SoHieuQN}`);

      // Delete DoanVien
      await DoanVienToDelete.destroy();
      console.log('Xóa đoàn viên thành công');
    }

    // Count DoanVien after deletion
    // const countAfter = await DoanVien.count();
    // console.log(`Tổng số đoàn viên sau khi xóa: ${countAfter}`);

  } catch (error) {
    console.error('Xóa đoàn viên bị lỗi: ', error);
  } finally {
    await sequelize.close();
  }
}

deleteDoanVien();
