import { DataTypes } from 'sequelize';
import { sequelize } from '../database.js';

const DoanVien = sequelize.define('DoanVien', {
  // Model attributes
  SoHieuQN: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  HoTen: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  NgaySinh: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  NgayNhapNgu: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    set(value) {
      this.setDataValue('NgayNhapNgu', `${value}-01`);
    },
    get() {
      const val = this.getDataValue('NgayNhapNgu');
      return val ? val.substring(0, 7) : null;
    }
  },
  CapBac: {
    type: DataTypes.STRING(3),
    allowNull: false
  },
  ChucVu: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  DonVi: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  DonViDangQuanLy: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  DanToc: {
    type: DataTypes.STRING(15),
    allowNull: false
  },
  TonGiao: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  TrinhDoVanHoa: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  VaoDangDoan: {
    type: DataTypes.ENUM('Đảng', 'Đoàn'),
    allowNull: false,
  },
  NgayVaoDangDoan: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  HoTenCha: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  HoTenMe: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  QueQuan: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  NoiOHienNay: {
    type: DataTypes.STRING(250),
    allowNull: false
  },
  SDT: {
    type: DataTypes.STRING(10),
    allowNull: false,
    validate: {
      isNumeric: true  // Chỉ cho phép ký tự số
    }
  },
  NhomMau: {
    type: DataTypes.STRING(3),
    allowNull: true
  },
  CMND: {
    type: DataTypes.STRING(12),
    allowNull: true,
    validate: {
      isNumeric: true
    }
  },
  PhuGhi: {
    type: DataTypes.STRING(500),
    allowNull: true
  }
}, {
  tableName: 'doanvien',
  timestamps: true // Adds createdAt and updatedAt columns
});

// Method to get DoanVien details
DoanVien.prototype.getDetails = function () {
  return [
    this.SoHieuQN, this.HoTen, this.NgaySinh, this.NgayNhapNgu,
    this.CapBac, this.ChucVu, this.DonVi, this.DonViDangQuanLy, this.DanToc,
    this.TonGiao, this.TrinhDoVanHoa, this.VaoDangDoan,
    this.NgayVaoDangDoan, this.HoTenCha, this.HoTenMe,
    this.QueQuan, this.NoiOHienNay, this.SDT, this.NhomMau,
    this.CMND, this.PhuGhi
  ].join(' - ');
};

export default DoanVien;