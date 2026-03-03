import DoanVien from './models/doanvien.js';
import { sequelize } from './database.js';

async function addDoanVien() {
  try {
    // Create DoanVien objects using the create method
    const doanvien = await Promise.all([
      DoanVien.create({
        SoHieuQN: 20029461,
        HoTen: 'Nguyễn Thanh Hùng',
        NgaySinh: '1998-08-12',
        NgayNhapNgu: '2016-09',
        CapBac: '3/',
        ChucVu: 'ct',
        DonVi: '12/6/e88',
        DanToc: 'Kinh',
        TonGiao: 'Không',
        TrinhDoVanHoa: 'ĐH',
        VaoDangDoan: 'Đảng',
        NgayVaoDangDoan: '2019-06-29',
        HoTenCha: 'Nguyễn Văn Thanh',
        HoTenMe: 'Võ Thị Thiều',
        QueQuan: 'Long An',
        NoiOHienNay: '195 Bình Trung 2, Tân An, Tây Ninh',
        SDT: '0384203153',
        NhomMau: 'O',
        CMND: null,
        PhuGhi: null
      }),
      DoanVien.create({
        SoHieuQN: 22041141,
        HoTen: 'Huỳnh Phúc Tài',
        NgaySinh: '1996-02-23',
        NgayNhapNgu: '2020-02',
        CapBac: '3/',
        ChucVu: 'pct',
        DonVi: '12/6/e88',
        DanToc: 'Kinh',
        TonGiao: 'Không',
        TrinhDoVanHoa: 'ĐH',
        VaoDangDoan: 'Đảng',
        NgayVaoDangDoan: '2022-12-25',
        HoTenCha: 'Huỳnh Thanh Lý',
        HoTenMe: 'Nguyễn Thị Thu Thủy',
        QueQuan: 'Đồng Tháp',
        NoiOHienNay: 'Ấp Hội Nhơn, Hiệp Đức, Đồng Tháp',
        SDT: '0336474397',
        NhomMau: null,
        CMND: null,
        PhuGhi: null
      }),
      DoanVien.create({
        SoHieuQN: 23018800,
        HoTen: 'Đặng Võ Đức Minh',
        NgaySinh: '2001-08-18',
        NgayNhapNgu: '2019-08',
        CapBac: '3/',
        ChucVu: 'ctvp',
        DonVi: '12/6/e88',
        DanToc: 'Kinh',
        TonGiao: 'Không',
        TrinhDoVanHoa: 'ĐH',
        VaoDangDoan: 'Đảng',
        NgayVaoDangDoan: '2022-11-20',
        HoTenCha: 'Đặng Đức Chiến',
        HoTenMe: 'Võ Thị Tuyền',
        QueQuan: 'Nghệ An',
        NoiOHienNay: 'Tổ 22, Đức Trọng, Lâm Đồng',
        SDT: '0367318228',
        NhomMau: null,
        CMND: null,
        PhuGhi: null
      })
    ]);

    // Print the newly created books with their IDs
    doanvien.forEach(dv => {
      console.log(`Thêm 1 đoàn viên thành công: ${dv.getDetails()}`);
    });


  } catch (error) {
    console.error('Thêm bản ghi lỗi:', error);
  } finally {
    await sequelize.close();
  }
}

addDoanVien();
