// import controller from '../controllers/doanvien.js';
import createDoanVien,{ getAllDoanVien, getDoanVienById,  updateDoanVien, deleteDoanVien } from '../controllers/doanvien.js';
import express from 'express';

const router = express.Router();

// CRUD Routes /doanvien
router.get('/', getAllDoanVien); // /doanvien
router.get('/:doanvienId', getDoanVienById); // /doanvien/:doanvienId
router.post('/', createDoanVien); // /doanvien
router.put('/:doanvienId', updateDoanVien); // /doanvien/:doanvienId
router.delete('/:doanvienId', deleteDoanVien); // /doanvien/:doanvienId

export default router;