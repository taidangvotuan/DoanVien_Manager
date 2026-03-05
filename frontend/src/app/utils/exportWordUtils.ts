import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, BorderStyle, WidthType, ShadingType, VerticalAlign,
  VerticalMergeType} from "docx";

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

interface Activity {
  id: string;
  name: string;
  memberCount: number;
  amountPerMember: number;
}

interface FixedIncome {
  id: string;
  name: string;
  memberCount: number;
  amountPerMember: number;
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
  activities: Activity[]; 
  fixedIncomes: FixedIncome[];
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
  rowspan?: number;
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
  indent?: number;
}

const mkPara = (text: string, opts: ParaOpts = {}) =>
  new Paragraph({
    alignment: opts.align ?? AlignmentType.LEFT,
    spacing:   { before: opts.before ?? 60, after: opts.after ?? 60 },
    indent:    opts.indent ? { left: opts.indent } : undefined,
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
    currentMonth, platoonFees, activities, fixedIncomes,
    previousBalance, otherIncomes, expenses,
  } = data;

  // ── Totals ──────────────────────────────────────────────────────────────────
  const totalPlatoonFees  = platoonFees.reduce((s, p) => s + calcPlatoonTotal(p), 0);
  const totalActivities  = activities.reduce((s, a) => s + a.memberCount * a.amountPerMember, 0);
  const totalFixedIncome = fixedIncomes.reduce((s, f) => s + f.memberCount * f.amountPerMember, 0);
  const totalOtherIncome  = otherIncomes.reduce((s, i) => s + i.amount, 0);
  const totalIncome       = totalPlatoonFees + totalActivities + totalFixedIncome
                           + previousBalance + totalOtherIncome;
  const totalExpense      = expenses.reduce((s, e) => s + e.amount, 0);
  const remainingBalance  = totalIncome - totalExpense;

  // ── Content width: A4 with narrow margins ───────────────────────────────────
  // Page: 11906 wide; margins: left=1080, right=720 → content = 10106
  const CONTENT_W = 10106;

  // ── Document ─────────────────────────────────────────────────────────────────
  const doc = new Document({
    styles: {
      default: { document: { run: { font: "Times New Roman", size: 26 } } },
    },
    sections: [
      {
        properties: {
          page: {
            size:   { width: 11906, height: 16838 }, // A4
            margin: { top: 720, right: 720, bottom: 720, left: 1080 },
          },
        },
        children: [

          // ── Letterhead ──────────────────────────────────────────────────────
          new Table({
            width: { size: CONTENT_W, type: WidthType.DXA },
            columnWidths: [Math.round(CONTENT_W * 0.43), Math.round(CONTENT_W * 0.57)],
            borders: {
              top: noBorder, bottom: noBorder,
              left: noBorder, right: noBorder,
              insideHorizontal: noBorder, insideVertical: noBorder,
            },
            rows: [
              new TableRow({
                children: [
                  // Left column – unit info
                  new TableCell({
                    borders: noBorders,
                    width: { size: Math.round(CONTENT_W * 0.43), type: WidthType.DXA },
                    children: [
                      mkPara("ĐOÀN CƠ SỞ TRUNG ĐOÀN 88", { align: AlignmentType.CENTER, size: 26 }),
                      mkPara("CHI ĐOÀN 17",               { align: AlignmentType.CENTER, bold: true }),
                      mkPara("***",                        { align: AlignmentType.CENTER, size: 26 }),
                    ],
                  }),
                  new TableCell({
                    borders: noBorders,
                    width: { size: Math.round(CONTENT_W * 0.57), type: WidthType.DXA },
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
          mkPara("I. TỔNG HỢP", { bold: true, before: 120, after: 80 }),
          (() => {
            // Column widths that sum to CONTENT_W
            const colTT   = 500;
            const colName = 2400;
            const colDV1  = 900;   // ĐV Tổng
            const colDV2  = 1300;  // ĐV Số tiền
            const colDNT1 = 900;   // ĐNT Tổng
            const colDNT2 = 1300;  // ĐNT Số tiền
            const colSum  = 1600;  // Cộng thu
            const colSign = 1206;  // Ký tên

            const shd = headerShading;

 // Helper: vertically-merged START cell (has content, opens the span)
            const mkVStart = (text: string, w: number, opts: CellOpts = {}) =>
              new TableCell({
                borders:       thinBorders,
                width:         { size: w, type: WidthType.DXA },
                shading:       (opts.shading ?? shd) as any,
                verticalAlign: VerticalAlign.CENTER,
                verticalMerge: VerticalMergeType.RESTART,
                margins:       { top: 60, bottom: 60, left: 80, right: 80 },
                children: [new Paragraph({
                  alignment: opts.align ?? AlignmentType.CENTER,
                  children: [new TextRun({ text, bold: opts.bold ?? true, size: 26, font: "Times New Roman" })],
                })],
              });

            // Helper: vertically-merged CONTINUE cell (empty, continues the span)
            const mkVCont = (w: number, opts: CellOpts = {}) =>
              new TableCell({
                borders:       thinBorders,
                width:         { size: w, type: WidthType.DXA },
                shading:       (opts.shading ?? shd) as any,
                verticalAlign: VerticalAlign.CENTER,
                verticalMerge: VerticalMergeType.CONTINUE,
                margins:       { top: 60, bottom: 60, left: 80, right: 80 },
                children: [new Paragraph({ children: [] })],
              });

            return new Table({
              width: { size: CONTENT_W, type: WidthType.DXA },
              columnWidths: [colTT, colName, colDV1, colDV2, colDNT1, colDNT2, colSum, colSign],
              rows: [
                // ── Header row 1: TT* | Tên đơn vị* | Đoàn viên H (span 2) | Đảng viên trẻ (span 2) | Cộng thu* | Ký tên*
                // (* = will span 2 rows via vMerge)
                new TableRow({
                  children: [
                    mkVStart("TT",          colTT),
                    mkVStart("Tên đơn vị",  colName),
                    // "Đoàn viên H" colspan=2
                    new TableCell({
                      borders: thinBorders, columnSpan: 2,
                      width: { size: colDV1 + colDV2, type: WidthType.DXA },
                      shading: shd as any,
                      verticalAlign: VerticalAlign.CENTER,
                      margins: { top: 60, bottom: 60, left: 80, right: 80 },
                      children: [new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [new TextRun({ text: "Đoàn viên\nH", bold: true, size: 26, font: "Times New Roman" })],
                      })],
                    }),
                    // "Đảng viên trẻ" colspan=2
                    new TableCell({
                      borders: thinBorders, columnSpan: 2,
                      width: { size: colDNT1 + colDNT2, type: WidthType.DXA },
                      shading: shd as any,
                      verticalAlign: VerticalAlign.CENTER,
                      margins: { top: 60, bottom: 60, left: 80, right: 80 },
                      children: [new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [new TextRun({ text: "Đảng viên trẻ", bold: true, size: 26, font: "Times New Roman" })],
                      })],
                    }),
                    mkVStart("Cộng thu", colSum),
                    mkVStart("Ký tên",   colSign),
                  ],
                }),
                // ── Header row 2: continue TT & Tên đơn vị | Tổng | Số tiền | Tổng | Số tiền | continue Cộng thu & Ký tên
                new TableRow({
                  children: [
                    mkVCont(colTT),    // TT continued
                    mkVCont(colName),  // Tên đơn vị continued
                    mkCell("Tổng",    { bold: true, shading: shd, width: { size: colDV1,  type: WidthType.DXA } }),
                    mkCell("Số tiền", { bold: true, shading: shd, width: { size: colDV2,  type: WidthType.DXA } }),
                    mkCell("Tổng",    { bold: true, shading: shd, width: { size: colDNT1, type: WidthType.DXA } }),
                    mkCell("Số tiền", { bold: true, shading: shd, width: { size: colDNT2, type: WidthType.DXA } }),
                    mkVCont(colSum),   // Cộng thu continued
                    mkVCont(colSign),  // Ký tên continued
                  ],
                }),
                // ── Data rows (one per platoon) ──
                ...platoonFees.map((p, i) =>
                  new TableRow({
                    children: [
                      mkCell(String(i + 1),                       { width: { size: colTT,   type: WidthType.DXA } }),
                      mkCell(p.platoon, { align: AlignmentType.LEFT, width: { size: colName, type: WidthType.DXA } }),
                      mkCell(String(calcDVCount(p)),              { width: { size: colDV1,  type: WidthType.DXA } }),
                      mkCell(formatCurrency(calcDVTotal(p)),      { width: { size: colDV2,  type: WidthType.DXA } }),
                      mkCell(String(calcDNTCount(p)),             { width: { size: colDNT1, type: WidthType.DXA } }),
                      mkCell(formatCurrency(calcDNTTotal(p)),     { width: { size: colDNT2, type: WidthType.DXA } }),
                      mkCell(formatCurrency(calcPlatoonTotal(p)), { bold: true, width: { size: colSum,  type: WidthType.DXA } }),
                      mkCell("",                                  { width: { size: colSign, type: WidthType.DXA } }),
                    ],
                  })
                ),
                // ── Totals row: "Tổng" spans cols 1-2, then totals ──
                new TableRow({
                  children: [
                    new TableCell({
                      borders: thinBorders, columnSpan: 2,
                      shading: shd as any,
                      width: { size: colTT + colName, type: WidthType.DXA },
                      verticalAlign: VerticalAlign.CENTER,
                      margins: { top: 60, bottom: 60, left: 80, right: 80 },
                      children: [new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [new TextRun({ text: "Tổng", bold: true, size: 26, font: "Times New Roman" })],
                      })],
                    }),
                    mkCell(String(platoonFees.reduce((s, p) => s + calcDVCount(p), 0)),           { bold: true, shading: shd, width: { size: colDV1,  type: WidthType.DXA } }),
                    mkCell(formatCurrency(platoonFees.reduce((s, p) => s + calcDVTotal(p), 0)),   { bold: true, shading: shd, width: { size: colDV2,  type: WidthType.DXA } }),
                    mkCell(String(platoonFees.reduce((s, p) => s + calcDNTCount(p), 0)),          { bold: true, shading: shd, width: { size: colDNT1, type: WidthType.DXA } }),
                    mkCell(formatCurrency(platoonFees.reduce((s, p) => s + calcDNTTotal(p), 0)), { bold: true, shading: shd, width: { size: colDNT2, type: WidthType.DXA } }),
                    mkCell(formatCurrency(totalPlatoonFees),                                      { bold: true, shading: shd, width: { size: colSum,  type: WidthType.DXA } }),
                    mkCell("",                                                                    { shading: shd, width: { size: colSign, type: WidthType.DXA } }),
                  ],
                }),
              ],
            });
          })(),

          // ── Section II: Income ───────────────────────────────────────────────
          mkPara("II. PHẦN THU", { bold: true, before: 200, after: 100 }),
          mkPara(`- Tổng thu nộp đoàn phí: ${formatCurrency(totalPlatoonFees)}`),
          mkPara(`   + Nộp lên trên (1/3): ${formatCurrency(Math.round(totalPlatoonFees / 3))}`),
          mkPara(`   + Trích giữ lại (2/3): ${formatCurrency(Math.round(totalPlatoonFees * 2 / 3))}`),
          // Activities (dynamic list)
          ...activities.map(a =>
            mkPara(`- ${a.name}: ${a.memberCount} x ${formatCurrency(a.amountPerMember)} = ${formatCurrency(a.memberCount * a.amountPerMember)}`)
          ),

          // Fixed incomes (dynamic list)
          ...fixedIncomes.map(f =>
            mkPara(`- ${f.name}: ${f.memberCount} x ${formatCurrency(f.amountPerMember)} = ${formatCurrency(f.memberCount * f.amountPerMember)}`)
          ),

          // Previous balance
          mkPara(`- Tiền còn lại của tháng trước: ${formatCurrency(previousBalance)}`),
          
          // Other incomes
          otherIncomes.length === 0
            ? mkPara("- Thu khác: Không")
            : mkPara(`- Thu khác: ${otherIncomes.map(i => `${i.activity}: ${formatCurrency(i.amount)}${i.description ? ` (${i.description})` : ""}`).join("; ")}`),
          mkPara(`* Tổng thu: ${formatCurrency(totalIncome)}`, { bold: true }),

          // ── Section III: Expenses ────────────────────────────────────────────
          mkPara("III. PHẦN CHI", { bold: true, before: 200, after: 100 }),

          (() => {
            const colTT      = 500;
            const colContent = 3906;
            const colAmount  = 1700;
            const colSpender = 2000;
            const colApprover= 2000;
            const shd = headerShading;

            return new Table({
              width: { size: CONTENT_W, type: WidthType.DXA },
              columnWidths: [colTT, colContent, colAmount, colSpender, colApprover],
              rows: [
                // Header
                new TableRow({
                  children: [
                    mkCell("TT",           { bold: true, shading: shd, width: { size: colTT,       type: WidthType.DXA } }),
                    mkCell("Nội dung chi", { bold: true, shading: shd, align: AlignmentType.LEFT, width: { size: colContent,  type: WidthType.DXA } }),
                    mkCell("Số tiền",      { bold: true, shading: shd, width: { size: colAmount,   type: WidthType.DXA } }),
                    mkCell("Người chi",    { bold: true, shading: shd, width: { size: colSpender,  type: WidthType.DXA } }),
                    mkCell("Người duyệt", { bold: true, shading: shd, width: { size: colApprover, type: WidthType.DXA } }),
                  ],
                }),
                // Expense rows
                ...expenses.map((e, i) =>
                  new TableRow({
                    children: [
                      mkCell(String(i + 1),          { width: { size: colTT,       type: WidthType.DXA } }),
                      mkCell(e.content, { align: AlignmentType.LEFT, width: { size: colContent,  type: WidthType.DXA } }),
                      mkCell(formatCurrency(e.amount), { width: { size: colAmount,   type: WidthType.DXA } }),
                      mkCell(e.spender,              { width: { size: colSpender,  type: WidthType.DXA } }),
                      mkCell(e.approver,             { width: { size: colApprover, type: WidthType.DXA } }),
                    ],
                  })
                ),
                // Totals row
                new TableRow({
                  children: [
                    new TableCell({
                      borders: thinBorders, columnSpan: 2,
                      shading: shd as any,
                      width: { size: colTT + colContent, type: WidthType.DXA },
                      verticalAlign: VerticalAlign.CENTER,
                      margins: { top: 60, bottom: 60, left: 80, right: 80 },
                      children: [new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [new TextRun({ text: "Tổng chi:", bold: true, size: 26, font: "Times New Roman" })],
                      })],
                    }),
                    mkCell(formatCurrency(totalExpense), { bold: true, shading: shd, width: { size: colAmount,   type: WidthType.DXA } }),
                    mkCell("",                           { shading: shd,             width: { size: colSpender,  type: WidthType.DXA } }),
                    mkCell("",                           { shading: shd,             width: { size: colApprover, type: WidthType.DXA } }),
                  ],
                }),
              ],
            });
          })(),

          // ── Section IV: Carry forward ────────────────────────────────────────
          mkPara(`IV. CHUYỂN THÁNG SAU: ${formatCurrency(remainingBalance)}`, { bold: true, before: 200, after: 200 }),

          // ── Signature block ──────────────────────────────────────────────────
          new Table({
            width: { size: CONTENT_W, type: WidthType.DXA },
            columnWidths: [Math.round(CONTENT_W / 2), Math.round(CONTENT_W / 2)],
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