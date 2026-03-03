import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { Member } from '../components/MemberDialog';

const DON_VI_ORDER = [
    "CHỈ HUY ĐẠI ĐỘI",
    "TRUNG ĐỘI HL 1",
    "KHẨU ĐỘI 1",
    "KHẨU ĐỘI 2",
    "TRUNG ĐỘI HL 2",
    "KHẨU ĐỘI 3",
    "KHẨU ĐỘI 4"
];

const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

const formatMonth = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${year}`;
};

export const exportToExcel = async (members: Member[]) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Danh sách trích ngang');

    // Set column widths without headers to avoid the extra row
    worksheet.columns = [
        { key: 'tt', width: 5 },
        { key: 'hoTen', width: 25 },
        { key: 'ngaySinh', width: 15 },
        { key: 'nhapNgu', width: 12 },
        { key: 'soHieu', width: 15 },
        { key: 'capBac', width: 10 },
        { key: 'chucVu', width: 12 },
        { key: 'donVi', width: 15 },
        { key: 'danToc', width: 10 },
        { key: 'tonGiao', width: 10 },
        { key: 'vanHoa', width: 10 },
        { key: 'dang', width: 7 },
        { key: 'doan', width: 7 },
        { key: 'ngayDangDoan', width: 15 },
        { key: 'hoTenCha', width: 20 },
        { key: 'hoTenMe', width: 20 },
        { key: 'queQuan', width: 25 },
        { key: 'noiO', width: 30 },
        { key: 'sdt', width: 15 },
        { key: 'nhomMau', width: 10 },
        { key: 'cmnd', width: 15 },
        { key: 'phuGhi', width: 20 },
    ];

    // 1. Header rows
    // Row 1: Left (Unit), Right (National motto)
    const row1 = worksheet.getRow(1);
    row1.getCell(1).value = 'TIỂU ĐOÀN 6';
    row1.getCell(1).font = { bold: true, size: 11 };

    row1.getCell(12).value = 'CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM';
    row1.getCell(12).font = { bold: true, size: 11 };
    row1.getCell(12).alignment = { horizontal: 'center' };
    worksheet.mergeCells(1, 12, 1, 22);

    // Row 2: Left (Unit sub), Right (Motto 2)
    const row2 = worksheet.getRow(2);
    row2.getCell(1).value = 'Đại đội 12';
    row2.getCell(1).font = { bold: true, size: 11, underline: true };

    row2.getCell(12).value = 'Độc lập - Tự do - Hạnh phúc';
    row2.getCell(12).font = { bold: true, size: 11, underline: true };
    row2.getCell(12).alignment = { horizontal: 'center' };
    worksheet.mergeCells(2, 12, 2, 22);

    // Row 3: Date
    const date = new Date();
    const row3 = worksheet.getRow(3);
    row3.getCell(12).value = `Đồng Nai, ngày ${date.getDate()} tháng ${date.getMonth() + 1} năm ${date.getFullYear()}`;
    row3.getCell(12).font = { italic: true, size: 10 };
    row3.getCell(12).alignment = { horizontal: 'center' };
    worksheet.mergeCells(3, 12, 3, 22);

    // Row 5-6: Title
    const row5 = worksheet.getRow(5);
    row5.getCell(1).value = 'DANH SÁCH';
    row5.getCell(1).font = { bold: true, size: 13 };
    row5.getCell(1).alignment = { horizontal: 'center' };
    worksheet.mergeCells(5, 1, 5, 22);

    const row6 = worksheet.getRow(6);
    row6.getCell(1).value = 'TRÍCH NGANG TOÀN ĐƠN VỊ';
    row6.getCell(1).font = { bold: true, size: 13 };
    row6.getCell(1).alignment = { horizontal: 'center' };
    worksheet.mergeCells(6, 1, 6, 22);

    // 2. Table Headers
    const headerRow = worksheet.getRow(8);
    const columns = [
        'TT', 'Họ và tên', 'Ngày, tháng, năm sinh', 'Nhập ngũ', 'Số hiệu QN',
        'Cấp bậc', 'Chức vụ', 'Đơn vị', 'Dân tộc', 'Tôn giáo', 'Văn hóa',
        'Đảng', 'Đoàn', 'Ngày vào Đảng, Đoàn', 'Họ tên cha', 'Họ tên mẹ',
        'Quê quán', 'Nơi ở hiện nay', 'SĐT', 'Nhóm máu', 'Số CMND', 'Phụ ghi'
    ];

    columns.forEach((col, index) => {
        const cell = headerRow.getCell(index + 1);
        cell.value = col;
        cell.font = { bold: true, size: 10 };
        cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
        cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };
    });
    headerRow.height = 35;

    // 3. Data Rows grouped by DonVi
    let currentRow = 9;
    let globalIndex = 1;

    const addMembersToGroup = (membersToGroup: Member[], groupName: string) => {
        if (membersToGroup.length > 0) {
            // Group header row
            const groupRow = worksheet.getRow(currentRow);
            groupRow.getCell(1).value = groupName;
            groupRow.getCell(1).font = { bold: true };
            groupRow.getCell(1).alignment = { horizontal: 'center' };
            worksheet.mergeCells(currentRow, 1, currentRow, 22);

            // Add borders to group row
            for (let i = 1; i <= 22; i++) {
                groupRow.getCell(i).border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
            }

            currentRow++;

            // Member rows
            membersToGroup.forEach(member => {
                const row = worksheet.getRow(currentRow);
                const vaoDangDoan = member.VaoDangDoan || "";
                row.values = [
                    globalIndex++,
                    member.HoTen,
                    formatDate(member.NgaySinh),
                    formatMonth(member.NgayNhapNgu),
                    member.SoHieuQN,
                    member.CapBac,
                    member.ChucVu,
                    member.DonVi,
                    member.DanToc,
                    member.TonGiao,
                    member.TrinhDoVanHoa,
                    vaoDangDoan === 'Đảng' ? 'x' : '',
                    vaoDangDoan === 'Đoàn' ? 'x' : '',
                    formatDate(member.NgayVaoDangDoan || ""),
                    member.HoTenCha,
                    member.HoTenMe,
                    member.QueQuan,
                    member.NoiOHienNay,
                    member.SDT,
                    member.NhomMau,
                    member.CMND,
                    member.PhuGhi
                ];

                // Style data cells
                for (let i = 1; i <= 22; i++) {
                    row.getCell(i).border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    };
                    row.getCell(i).alignment = { vertical: 'middle', wrapText: true };
                    row.getCell(i).font = { size: 10 };
                    if (i === 1 || (i >= 3 && i <= 14) || (i >= 19 && i <= 21)) {
                        row.getCell(i).alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
                    }
                }
                currentRow++;
            });
        }
    };

    DON_VI_ORDER.forEach(donVi => {
        addMembersToGroup(members.filter(m => m.DonVi === donVi), donVi);
    });

    const otherMembers = members.filter(m => !DON_VI_ORDER.includes(m.DonVi));
    addMembersToGroup(otherMembers, "KHÁC");

    // 4. Footer / Signature
    currentRow += 2;
    const signatureLabelRow = worksheet.getRow(currentRow);
    signatureLabelRow.getCell(19).value = 'ĐẠI ĐỘI TRƯỜNG';
    signatureLabelRow.getCell(19).font = { bold: true };
    signatureLabelRow.getCell(19).alignment = { horizontal: 'center' };
    worksheet.mergeCells(currentRow, 19, currentRow, 22);

    currentRow += 4;
    const signatureNameRow = worksheet.getRow(currentRow);
    signatureNameRow.getCell(19).value = '';
    signatureNameRow.getCell(19).font = { bold: true };
    signatureNameRow.getCell(19).alignment = { horizontal: 'center' };
    worksheet.mergeCells(currentRow, 19, currentRow, 22);

    // Generate and save file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `Danh_sach_trich_ngang_${new Date().toISOString().split('T')[0]}.xlsx`);
};
