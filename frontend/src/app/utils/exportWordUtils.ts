import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, BorderStyle, WidthType, ShadingType, VerticalAlign,
} from "docx";

// ─── Types (mirror FeesPage.tsx) ─────────────────────────────────────────────

interface PlatoonFee {
  platoon: string;
  h1Count: number; h1Amount: number;
  h2Count: number; h2Amount: number;
  h3Count: number; h3Amount: number;
  r1Count: number; r1Amount: number;
  r2Count: number; r2Amount: number;
  r3Count: number; r3Amount: number;
}

interface OtherIncome {
  id: string;
  activity: string;
  amount: number;
  description: string;
}

interface Expense {
  id: string;
  content: string;
  amount: number;
  spender: string;
  approver: string;
}

export interface ExportData {
  currentMonth: string;
  platoonFees: PlatoonFee[];
  house100Count: number;
  house100Amount: number;
  activityCount: number;
  activityAmount: number;
  haircutCount: number;
  haircutAmount: number;
  previousBalance: number;
  otherIncomes: OtherIncome[];
  expenses: Expense[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);

const calcDVCount  = (p: PlatoonFee) => p.h1Count + p.h2Count + p.h3Count;
const calcDNTCount = (p: PlatoonFee) => p.r1Count + p.r2Count + p.r3Count;
const calcDVTotal  = (p: PlatoonFee) => p.h1Count * p.h1Amount + p.h2Count * p.h2Amount + p.h3Count * p.h3Amount;
const calcDNTTotal = (p: PlatoonFee) => p.r1Count * p.r1Amount + p.r2Count * p.r2Amount + p.r3Count * p.r3Amount;
const calcPlatoonTotal = (p: PlatoonFee) => calcDVTotal(p) + calcDNTTotal(p);

// ─── Border / Shading presets ─────────────────────────────────────────────────

const noBorder  = { style: BorderStyle.NONE,   size: 0, color: "FFFFFF" } as const;
const thinBorder = { style: BorderStyle.SINGLE, size: 4, color: "000000" } as const;
const noBorders  = { top: noBorder,  bottom: noBorder,  left: noBorder,  right: noBorder };
const thinBorders = { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder };
const headerShading = { fill: "FFFFFF", type: ShadingType.CLEAR };

// ─── Cell / Paragraph builders ────────────────────────────────────────────────

interface CellOpts {
  bold?: boolean;
  align?: (typeof AlignmentType)[keyof typeof AlignmentType];
  size?: number;
  width?: { size: number; type: (typeof WidthType)[keyof typeof WidthType] };
  shading?: { fill: string; type: string };
  colspan?: number;
  borders?: typeof thinBorders;
}

const mkCell = (text: string, opts: CellOpts = {}) =>
  new TableCell({
    borders:      opts.borders  ?? thinBorders,
    width:        opts.width    ?? { size: 1000, type: WidthType.DXA },
    shading:      opts.shading  as any,
    verticalAlign: VerticalAlign.CENTER,
    columnSpan:   opts.colspan  ?? 1,
    margins:      { top: 60, bottom: 60, left: 80, right: 80 },
    children: [
      new Paragraph({
        alignment: opts.align ?? AlignmentType.CENTER,
        children: [
          new TextRun({
            text,
            bold:  opts.bold ?? false,
            size:  opts.size ?? 26,
            font:  "Times New Roman",
          }),
        ],
      }),
    ],
  });

interface ParaOpts {
  bold?: boolean;
  italic?: boolean;
  size?: number;
  align?: (typeof AlignmentType)[keyof typeof AlignmentType];
  before?: number;
  after?: number;
}

const mkPara = (text: string, opts: ParaOpts = {}) =>
  new Paragraph({
    alignment: opts.align ?? AlignmentType.LEFT,
    spacing:   { before: opts.before ?? 60, after: opts.after ?? 60 },
    children: [
      new TextRun({
        text,
        bold:    opts.bold   ?? false,
        italics: opts.italic ?? false,
        size:    opts.size   ?? 26,
        font:    "Times New Roman",
      }),
    ],
  });

// ─── Main export function ─────────────────────────────────────────────────────

/**
 * Builds a Word document from the given data and triggers a browser download.
 * Call this from FeesPage like:
 *   import { exportToWord } from "../utils/exportWordUtils";
 *   await exportToWord({ currentMonth, platoonFees, ... });
 */
export async function exportToWord(data: ExportData): Promise<void> {
  const {
    currentMonth, platoonFees,
    house100Count, house100Amount,
    activityCount, activityAmount,
    haircutCount,  haircutAmount,
    previousBalance, otherIncomes, expenses,
  } = data;

  // ── Totals ──────────────────────────────────────────────────────────────────
  const totalPlatoonFees  = platoonFees.reduce((s, p) => s + calcPlatoonTotal(p), 0);
  const totalHouse100     = house100Count * house100Amount;
  const totalActivity     = activityCount * activityAmount;
  const totalHaircut      = haircutCount  * haircutAmount;
  const totalOtherIncome  = otherIncomes.reduce((s, i) => s + i.amount, 0);
  const totalIncome       = totalPlatoonFees + totalHouse100 + totalActivity
                          + totalHaircut + previousBalance + totalOtherIncome;
  const totalExpense      = expenses.reduce((s, e) => s + e.amount, 0);
  const remainingBalance  = totalIncome - totalExpense;

  // ── Document ─────────────────────────────────────────────────────────────────
  const doc = new Document({
    styles: {
      default: { document: { run: { font: "Times New Roman", size: 26 } } },
    },
    sections: [
      {
        properties: {
          page: {
            size:   { width: 12240, height: 15840 },
            margin: { top: 720, right: 720, bottom: 720, left: 1080 },
          },
        },
        children: [

          // ── Letterhead ──────────────────────────────────────────────────────
          new Table({
            width: { size: 10440, type: WidthType.DXA },
            columnWidths: [4500, 5940],
            borders: {
              top: noBorder, bottom: noBorder,
              left: noBorder, right: noBorder,
              insideHorizontal: noBorder, insideVertical: noBorder,
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    borders: noBorders,
                    width: { size: 4500, type: WidthType.DXA },
                    children: [
                      mkPara("ĐOÀN CƠ SỞ TRUNG ĐOÀN 88", { align: AlignmentType.CENTER, size: 26 }),
                      mkPara("CHI ĐOÀN 17",               { align: AlignmentType.CENTER, bold: true }),
                      mkPara("***",                        { align: AlignmentType.CENTER, size: 26 }),
                    ],
                  }),
                  new TableCell({
                    borders: noBorders,
                    width: { size: 5940, type: WidthType.DXA },
                    children: [
                      mkPara("ĐOÀN TNCS HỒ CHÍ MINH",          { align: AlignmentType.CENTER, bold: true }),
                      mkPara(`Đồng Nai, ngày 15 tháng ${currentMonth.split("/")[0]} năm ${currentMonth.split("/")[1]}`, { align: AlignmentType.CENTER, italic: true, size: 26 }),
                    ],
                  }),
                ],
              }),
            ],
          }),

          // ── Title ────────────────────────────────────────────────────────────
          mkPara("TỔNG HỢP",                             { align: AlignmentType.CENTER, bold: true, size: 26, before: 200, after: 0 }),
          mkPara(`Thu, chi đoàn phí tháng ${currentMonth}`, { align: AlignmentType.CENTER, bold: true, size: 26, before: 60, after: 200 }),

          // ── Section I: Summary table ─────────────────────────────────────────
          mkPara("I. TỔNG HỢP", { bold: true, before: 100, after: 100 }),

          new Table({
            width: { size: 10440, type: WidthType.DXA },
            columnWidths: [500, 2200, 1200, 1400, 1200, 1400, 1540, 1000],
            rows: [
              // Header row 1
              new TableRow({
                children: [
                  mkCell("TT",         { bold: true, shading: headerShading, width: { size: 500,  type: WidthType.DXA } }),
                  mkCell("Tên đơn vị", { bold: true, shading: headerShading, width: { size: 2200, type: WidthType.DXA } }),
                  new TableCell({
                    borders: thinBorders, columnSpan: 2,
                    width: { size: 2600, type: WidthType.DXA },
                    shading: headerShading as any,
                    margins: { top: 60, bottom: 60, left: 80, right: 80 },
                    children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Đoàn viên",    bold: true, size: 26, font: "Times New Roman" })] })],
                  }),
                  new TableCell({
                    borders: thinBorders, columnSpan: 2,
                    width: { size: 2600, type: WidthType.DXA },
                    shading: headerShading as any,
                    margins: { top: 60, bottom: 60, left: 80, right: 80 },
                    children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Đảng viên trẻ", bold: true, size: 26, font: "Times New Roman" })] })],
                  }),
                  mkCell("Cộng thu", { bold: true, shading: headerShading, width: { size: 1540, type: WidthType.DXA } }),
                  mkCell("Ký tên",   { bold: true, shading: headerShading, width: { size: 1000, type: WidthType.DXA } }),
                ],
              }),
              // Header row 2
              new TableRow({
                children: [
                  mkCell("", { shading: headerShading, width: { size: 500,  type: WidthType.DXA } }),
                  mkCell("", { shading: headerShading, width: { size: 2200, type: WidthType.DXA } }),
                  mkCell("Tổng",    { bold: true, shading: headerShading, width: { size: 1200, type: WidthType.DXA } }),
                  mkCell("Số tiền", { bold: true, shading: headerShading, width: { size: 1400, type: WidthType.DXA } }),
                  mkCell("Tổng",    { bold: true, shading: headerShading, width: { size: 1200, type: WidthType.DXA } }),
                  mkCell("Số tiền", { bold: true, shading: headerShading, width: { size: 1400, type: WidthType.DXA } }),
                  mkCell("", { shading: headerShading, width: { size: 1540, type: WidthType.DXA } }),
                  mkCell("", { shading: headerShading, width: { size: 1000, type: WidthType.DXA } }),
                ],
              }),
              // Data rows
              ...platoonFees.map((p, i) =>
                new TableRow({
                  children: [
                    mkCell(String(i + 1),                   { width: { size: 500,  type: WidthType.DXA } }),
                    mkCell(p.platoon, { align: AlignmentType.LEFT, width: { size: 2200, type: WidthType.DXA } }),
                    mkCell(String(calcDVCount(p)),           { width: { size: 1200, type: WidthType.DXA } }),
                    mkCell(formatCurrency(calcDVTotal(p)),   { width: { size: 1400, type: WidthType.DXA } }),
                    mkCell(String(calcDNTCount(p)),          { width: { size: 1200, type: WidthType.DXA } }),
                    mkCell(formatCurrency(calcDNTTotal(p)),  { width: { size: 1400, type: WidthType.DXA } }),
                    mkCell(formatCurrency(calcPlatoonTotal(p)), { bold: true, width: { size: 1540, type: WidthType.DXA } }),
                    mkCell("",                               { width: { size: 1000, type: WidthType.DXA } }),
                  ],
                })
              ),
              // Totals row
              new TableRow({
                children: [
                  new TableCell({
                    borders: thinBorders, columnSpan: 2,
                    shading: headerShading as any,
                    width: { size: 2700, type: WidthType.DXA },
                    margins: { top: 60, bottom: 60, left: 80, right: 80 },
                    children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Tổng cộng", bold: true, size: 26, font: "Times New Roman" })] })],
                  }),
                  mkCell(String(platoonFees.reduce((s, p) => s + calcDVCount(p), 0)),            { bold: true, shading: headerShading, width: { size: 1200, type: WidthType.DXA } }),
                  mkCell(formatCurrency(platoonFees.reduce((s, p) => s + calcDVTotal(p), 0)),    { bold: true, shading: headerShading, width: { size: 1400, type: WidthType.DXA } }),
                  mkCell(String(platoonFees.reduce((s, p) => s + calcDNTCount(p), 0)),           { bold: true, shading: headerShading, width: { size: 1200, type: WidthType.DXA } }),
                  mkCell(formatCurrency(platoonFees.reduce((s, p) => s + calcDNTTotal(p), 0)),   { bold: true, shading: headerShading, width: { size: 1400, type: WidthType.DXA } }),
                  mkCell(formatCurrency(totalPlatoonFees),                                        { bold: true, shading: headerShading, width: { size: 1540, type: WidthType.DXA } }),
                  mkCell("", { shading: headerShading, width: { size: 1000, type: WidthType.DXA } }),
                ],
              }),
            ],
          }),

          // ── Section II: Income ───────────────────────────────────────────────
          mkPara("II. PHẦN THU", { bold: true, before: 200, after: 100 }),
          mkPara(`- Tổng thu nộp đoàn phí: ${formatCurrency(totalPlatoonFees)}`),
          mkPara(`   + Nộp lên trên (1/3): ${formatCurrency(Math.round(totalPlatoonFees / 3))}`),
          mkPara(`   + Trích giữ lại (2/3): ${formatCurrency(Math.round(totalPlatoonFees * 2 / 3))}`),
          mkPara(`- Ngôi nhà 100 đồng: ${house100Count} x ${formatCurrency(house100Amount)} = ${formatCurrency(totalHouse100)}`),
          mkPara(`- Thu từ các hoạt động: ${activityCount} x ${formatCurrency(activityAmount)} = ${formatCurrency(totalActivity)}`),
          mkPara(`- Tiền cắt tóc: ${haircutCount} x ${formatCurrency(haircutAmount)} = ${formatCurrency(totalHaircut)}`),
          mkPara(`- Tiền còn lại của tháng trước: ${formatCurrency(previousBalance)}`),
          mkPara(
            otherIncomes.length === 0
              ? "- Thu khác: Không"
              : `- Thu khác: ${otherIncomes.map((i) => `${i.activity}: ${formatCurrency(i.amount)}`).join(", ")}`
          ),
          mkPara(`* Tổng thu: ${formatCurrency(totalIncome)}`, { bold: true }),

          // ── Section III: Expenses ────────────────────────────────────────────
          mkPara("III. PHẦN CHI", { bold: true, before: 200, after: 100 }),

          new Table({
            width: { size: 10440, type: WidthType.DXA },
            columnWidths: [500, 3940, 2000, 2000, 2000],
            rows: [
              new TableRow({
                children: [
                  mkCell("TT",           { bold: true, shading: headerShading, width: { size: 500,  type: WidthType.DXA } }),
                  mkCell("Nội dung chi", { bold: true, shading: headerShading, align: AlignmentType.LEFT, width: { size: 3940, type: WidthType.DXA } }),
                  mkCell("Số tiền",      { bold: true, shading: headerShading, width: { size: 2000, type: WidthType.DXA } }),
                  mkCell("Người chi",    { bold: true, shading: headerShading, width: { size: 2000, type: WidthType.DXA } }),
                  mkCell("Người duyệt", { bold: true, shading: headerShading, width: { size: 2000, type: WidthType.DXA } }),
                ],
              }),
              ...expenses.map((e, i) =>
                new TableRow({
                  children: [
                    mkCell(String(i + 1),          { width: { size: 500,  type: WidthType.DXA } }),
                    mkCell(e.content, { align: AlignmentType.LEFT, width: { size: 3940, type: WidthType.DXA } }),
                    mkCell(formatCurrency(e.amount), { width: { size: 2000, type: WidthType.DXA } }),
                    mkCell(e.spender,              { width: { size: 2000, type: WidthType.DXA } }),
                    mkCell(e.approver,             { width: { size: 2000, type: WidthType.DXA } }),
                  ],
                })
              ),
              // Total row
              new TableRow({
                children: [
                  new TableCell({
                    borders: thinBorders, columnSpan: 2,
                    shading: headerShading as any,
                    width: { size: 4440, type: WidthType.DXA },
                    margins: { top: 60, bottom: 60, left: 80, right: 80 },
                    children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "Tổng chi:", bold: true, size: 26, font: "Times New Roman" })] })],
                  }),
                  mkCell(formatCurrency(totalExpense), { bold: true, shading: headerShading, width: { size: 2000, type: WidthType.DXA } }),
                  mkCell("", { shading: headerShading, width: { size: 2000, type: WidthType.DXA } }),
                  mkCell("", { shading: headerShading, width: { size: 2000, type: WidthType.DXA } }),
                ],
              }),
            ],
          }),

          // ── Section IV: Carry forward ────────────────────────────────────────
          mkPara(`IV. CHUYỂN THÁNG SAU: ${formatCurrency(remainingBalance)}`, { bold: true, before: 200, after: 200 }),

          // ── Signature block ──────────────────────────────────────────────────
          new Table({
            width: { size: 10440, type: WidthType.DXA },
            columnWidths: [5220, 5220],
            borders: {
              top: noBorder, bottom: noBorder,
              left: noBorder, right: noBorder,
              insideHorizontal: noBorder, insideVertical: noBorder,
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    borders: noBorders,
                    width: { size: 5220, type: WidthType.DXA },
                    children: [
                      mkPara("XÁC NHẬN CỦA ĐOÀN CƠ SỞ", { align: AlignmentType.CENTER, bold: true }),
                      mkPara("PHÓ BÍ THƯ",               { align: AlignmentType.CENTER, bold: true }),
                      mkPara("", { before: 200 }),
                      mkPara("", { before: 200 }),
                      mkPara("", { before: 200 }),
                      mkPara("Nguyễn Phương A", { align: AlignmentType.CENTER, bold: true }),
                    ],
                  }),
                  new TableCell({
                    borders: noBorders,
                    width: { size: 5220, type: WidthType.DXA },
                    children: [
                      mkPara("T.M BAN CHẤP HÀNH", { align: AlignmentType.CENTER, bold: true }),
                      mkPara("BÍ THƯ",             { align: AlignmentType.CENTER, bold: true }),
                      mkPara("", { before: 200 }),
                      mkPara("", { before: 200 }),
                      mkPara("", { before: 200 }),
                      mkPara("Đặng Võ B", { align: AlignmentType.CENTER, bold: true }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      },
    ],
  });

  // ── Browser download (no fs, no Node) ───────────────────────────────────────
  const blob = await Packer.toBlob(doc);
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = `Thu_Chi_Doan_Phi_${currentMonth.replace("/", "-")}.docx`;
  a.click();
  URL.revokeObjectURL(url);
}