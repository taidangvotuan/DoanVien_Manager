import DoanVien from '../models/doanvien.js';

// filepath: e:\QuanLyDoanVien\controllers\doanvien.js

// Create a new DoanVien
const createDoanVien = async (req, res) => {
    try {
        const doanVien = await DoanVien.create(req.body);
        res.status(201).json(doanVien);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
export default createDoanVien;
// Get all DoanVien
export const getAllDoanVien = async (req, res) => {
    try {
        const doanVienList = await DoanVien.findAll();
        res.status(200).json(doanVienList);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get DoanVien by ID
export const getDoanVienById = async (req, res) => {
    try {
        const doanVien = await DoanVien.findByPk(req.params.doanvienId);
        if (!doanVien) {
            return res.status(404).json({ error: 'DoanVien not found' });
        }
        res.status(200).json(doanVien);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update DoanVien
export const updateDoanVien = async (req, res) => {
    try {
        const doanVien = await DoanVien.findByPk(req.params.doanvienId);
        if (!doanVien) {
            return res.status(404).json({ error: 'DoanVien not found' });
        }
        await doanVien.update(req.body);
        res.status(200).json(doanVien);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete DoanVien
export const deleteDoanVien = async (req, res) => {
    try {
        const doanVien = await DoanVien.findByPk(req.params.doanvienId);
        if (!doanVien) {
            return res.status(404).json({ error: 'DoanVien not found' });
        }
        await doanVien.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
