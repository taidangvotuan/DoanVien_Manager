import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { exportToWord } from "../utils/exportWordUtils";
import { Lock, LockOpen, Download, Save, Plus, Trash2, Edit2, List } from "lucide-react";
import { toast, Toaster } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Textarea } from "../components/ui/textarea";

interface PlatoonFee {
  platoon: string;
  h1Count: number;
  h1Amount: number;
  h2Count: number;
  h2Amount: number;
  h3Count: number;
  h3Amount: number;
  r1Count: number;
  r1Amount: number;
  r2Count: number;
  r2Amount: number;
  r3Count: number;
  r3Amount: number;
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

interface MonthlySummary {
  month: string;
  totalIncome: number;
  totalExpense: number;
  balance: number;
  isLocked: boolean;
}

export default function FeesPage() {
  const [isLocked, setIsLocked] = useState(false);
  const [showSummaryList, setShowSummaryList] = useState(false);
  const [currentMonth, setCurrentMonth] = useState("01/2024");

  // Thu đoàn phí
  const [platoonFees, setPlatoonFees] = useState<PlatoonFee[]>([
    {
      platoon: "Phân đoàn 1",
      h1Count: 0,
      h1Amount: 50000,
      h2Count: 0,
      h2Amount: 50000,
      h3Count: 0,
      h3Amount: 50000,
      r1Count: 0,
      r1Amount: 60000,
      r2Count: 0,
      r2Amount: 60000,
      r3Count: 0,
      r3Amount: 60000,
    },
    {
      platoon: "Phân đoàn 2",
      h1Count: 0,
      h1Amount: 50000,
      h2Count: 0,
      h2Amount: 50000,
      h3Count: 0,
      h3Amount: 50000,
      r1Count: 0,
      r1Amount: 60000,
      r2Count: 0,
      r2Amount: 60000,
      r3Count: 0,
      r3Amount: 60000,
    },
  ]);

  // Ngôi nhà 100 đồng
  const [house100Count, setHouse100Count] = useState(0);
  const [house100Amount, setHouse100Amount] = useState(100000);

  // Thu từ các hoạt động
  const [activityCount, setActivityCount] = useState(0);
  const [activityAmount, setActivityAmount] = useState(50000);

  // Các khoản thu cố định
  const [haircutCount, setHaircutCount] = useState(0);
  const [haircutAmount, setHaircutAmount] = useState(20000);

  // Tiền còn lại tháng trước
  const [previousBalance, setPreviousBalance] = useState(0);

  // Các khoản thu khác
  const [otherIncomes, setOtherIncomes] = useState<OtherIncome[]>([
    {
      id: "1",
      activity: "Hoạt động văn nghệ",
      amount: 500000,
      description: "Thu từ buổi biểu diễn văn nghệ",
    },
  ]);

  // Các khoản chi
  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: "1",
      content: "Mua nước",
      amount: 200000,
      spender: "Nguyễn Văn A",
      approver: "Trần Văn B",
    },
  ]);

  // Dialog states
  const [showOtherIncomeDialog, setShowOtherIncomeDialog] = useState(false);
  const [editingIncome, setEditingIncome] = useState<OtherIncome | null>(null);

  // Historical data
  const [monthlySummaries] = useState<MonthlySummary[]>([
    // {
    //   month: "12/2023",
    //   totalIncome: 15000000,
    //   totalExpense: 10000000,
    //   balance: 5000000,
    //   isLocked: true,
    // },
    // {
    //   month: "11/2023",
    //   totalIncome: 14500000,
    //   totalExpense: 9500000,
    //   balance: 5000000,
    //   isLocked: true,
    // },
  ]);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Calculate totals
  const calculatePlatoonTotal = (platoon: PlatoonFee) => {
    return (
      platoon.h1Count * platoon.h1Amount +
      platoon.h2Count * platoon.h2Amount +
      platoon.h3Count * platoon.h3Amount +
      platoon.r1Count * platoon.r1Amount +
      platoon.r2Count * platoon.r2Amount +
      platoon.r3Count * platoon.r3Amount
    );
  };

  const totalPlatoonFees = platoonFees.reduce(
    (sum, p) => sum + calculatePlatoonTotal(p),
    0
  );

  const totalHouse100 = house100Count * house100Amount;
  const totalActivity = activityCount * activityAmount;
  const totalHaircut = haircutCount * haircutAmount;
  const totalOtherIncome = otherIncomes.reduce((sum, i) => sum + i.amount, 0);

  const totalIncome =
    totalPlatoonFees +
    totalHouse100 +
    totalActivity +
    totalHaircut +
    previousBalance +
    totalOtherIncome;

  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalToSubmit = totalIncome - totalExpense;
  const remainingBalance = totalToSubmit;

  // Handlers
  const handleLockToggle = () => {
    setIsLocked(!isLocked);
    toast.success(isLocked ? "Đã mở khóa chỉnh sửa" : "Đã khóa chỉnh sửa");
  };

  const handleSave = () => {
    toast.success("Đã lưu bản ghi thành công!");
  };

  const handleExportWord = async () => {
    try {
      await exportToWord({
        currentMonth, platoonFees,
        house100Count, house100Amount,
        activityCount, activityAmount,
        haircutCount,  haircutAmount,
        previousBalance,
        otherIncomes,
        expenses,
      });
      toast.success("Xuất báo cáo thành công!");
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra khi xuất file Word!");
    }
  };

  const handleAddOtherIncome = () => {
    setEditingIncome(null);
    setShowOtherIncomeDialog(true);
  };

  const handleEditOtherIncome = (income: OtherIncome) => {
    setEditingIncome(income);
    setShowOtherIncomeDialog(true);
  };

  const handleDeleteOtherIncome = (id: string) => {
    setOtherIncomes(otherIncomes.filter((i) => i.id !== id));
    toast.success("Đã xóa khoản thu");
  };

  const handleSaveOtherIncome = (income: OtherIncome) => {
    if (editingIncome) {
      setOtherIncomes(
        otherIncomes.map((i) => (i.id === income.id ? income : i))
      );
      toast.success("Đã cập nhật khoản thu");
    } else {
      setOtherIncomes([...otherIncomes, { ...income, id: Date.now().toString() }]);
      toast.success("Đã thêm khoản thu");
    }
    setShowOtherIncomeDialog(false);
  };

  const handleAddExpense = () => {
    setExpenses([
      ...expenses,
      {
        id: Date.now().toString(),
        content: "",
        amount: 0,
        spender: "",
        approver: "",
      },
    ]);
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter((e) => e.id !== id));
    toast.success("Đã xóa khoản chi");
  };

  const updatePlatoonFee = (index: number, field: keyof PlatoonFee, value: number) => {
    const newPlatoonFees = [...platoonFees];
    (newPlatoonFees[index] as any)[field] = value;
    setPlatoonFees(newPlatoonFees);
  };

  const updateExpense = (id: string, field: keyof Expense, value: string | number) => {
    setExpenses(
      expenses.map((e) => (e.id === id ? { ...e, [field]: value } : e))
    );
  };

  return (
    <>
      <Toaster position="top-right" richColors />

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="space-y-6">
          {/* Header Section */}
          <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Thu chi đoàn phí
                </h1>
                <div className="flex items-center gap-3">
                  <Label className="text-lg">Tháng báo cáo:</Label>
                  <Input
                    type="text"
                    value={currentMonth}
                    onChange={(e) => setCurrentMonth(e.target.value)}
                    disabled={isLocked}
                    className="w-32 font-semibold"
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowSummaryList(!showSummaryList)}
                  className="gap-2"
                >
                  <List className="h-4 w-4" />
                  Danh sách tổng hợp
                </Button>
                <Button
                  variant={isLocked ? "destructive" : "outline"}
                  onClick={handleLockToggle}
                  className="gap-2"
                >
                  {isLocked ? (
                    <>
                      <LockOpen className="h-4 w-4" />
                      Mở khóa
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4" />
                      Khóa chỉnh sửa
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleExportWord}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Xuất file Word
                </Button>
                <Button onClick={handleSave} className="gap-2">
                  <Save className="h-4 w-4" />
                  Lưu bản ghi
                </Button>
              </div>
            </div>
          </div>

          {/* Summary List */}
          {showSummaryList && (
            <div className="bg-card p-6 rounded-lg border border-border">
              <h2 className="text-xl font-semibold mb-4">
                Danh sách Tổng hợp thu chi
              </h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tháng</TableHead>
                    <TableHead>Tổng thu</TableHead>
                    <TableHead>Tổng chi</TableHead>
                    <TableHead>Số dư</TableHead>
                    <TableHead>Trạng thái</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {monthlySummaries.map((summary) => (
                    <TableRow key={summary.month}>
                      <TableCell className="font-medium">{summary.month}</TableCell>
                      <TableCell className="text-green-600">
                        {formatCurrency(summary.totalIncome)}
                      </TableCell>
                      <TableCell className="text-red-600">
                        {formatCurrency(summary.totalExpense)}
                      </TableCell>
                      <TableCell className="text-blue-600 font-semibold">
                        {formatCurrency(summary.balance)}
                      </TableCell>
                      <TableCell>
                        {summary.isLocked ? (
                          <span className="text-gray-500">🔒 Đã khóa</span>
                        ) : (
                          <span className="text-green-500">🔓 Đang mở</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Tiền còn lại tháng trước */}
          <div className="bg-blue-50 border-2 border-blue-300 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-blue-900">
                💰 Tiền còn lại tháng trước
              </h2>
              <div className="text-3xl font-bold text-blue-600">
                {formatCurrency(previousBalance)}
              </div>
            </div>
          </div>

          {/* Thu đoàn phí */}
          <div className="bg-card p-6 rounded-lg border border-border">
            <h2 className="text-2xl font-semibold mb-4">📋 Thu đoàn phí</h2>
            {platoonFees.map((platoon, index) => (
              <div key={index} className="mb-6">
                <h3 className="text-lg font-medium mb-3 text-primary">
                  {platoon.platoon}
                </h3>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-secondary/50">
                        <TableHead>Cấp bậc</TableHead>
                        <TableHead>Số thành viên</TableHead>
                        <TableHead>Số tiền/người</TableHead>
                        <TableHead>Tổng</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {/* Đoàn viên */}
                      <TableRow>
                        <TableCell colSpan={4} className="font-semibold bg-blue-100">
                          Đoàn viên
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>H1</TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={platoon.h1Count}
                            onChange={(e) =>
                              updatePlatoonFee(index, "h1Count", Number(e.target.value))
                            }
                            disabled={isLocked}
                            className="w-24"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={platoon.h1Amount}
                            onChange={(e) =>
                              updatePlatoonFee(index, "h1Amount", Number(e.target.value))
                            }
                            disabled={isLocked}
                            className="w-32"
                          />
                        </TableCell>
                        <TableCell className="font-semibold">
                          {formatCurrency(platoon.h1Count * platoon.h1Amount)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>H2</TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={platoon.h2Count}
                            onChange={(e) =>
                              updatePlatoonFee(index, "h2Count", Number(e.target.value))
                            }
                            disabled={isLocked}
                            className="w-24"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={platoon.h2Amount}
                            onChange={(e) =>
                              updatePlatoonFee(index, "h2Amount", Number(e.target.value))
                            }
                            disabled={isLocked}
                            className="w-32"
                          />
                        </TableCell>
                        <TableCell className="font-semibold">
                          {formatCurrency(platoon.h2Count * platoon.h2Amount)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>H3</TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={platoon.h3Count}
                            onChange={(e) =>
                              updatePlatoonFee(index, "h3Count", Number(e.target.value))
                            }
                            disabled={isLocked}
                            className="w-24"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={platoon.h3Amount}
                            onChange={(e) =>
                              updatePlatoonFee(index, "h3Amount", Number(e.target.value))
                            }
                            disabled={isLocked}
                            className="w-32"
                          />
                        </TableCell>
                        <TableCell className="font-semibold">
                          {formatCurrency(platoon.h3Count * platoon.h3Amount)}
                        </TableCell>
                      </TableRow>
                      {/* Đảng viên trẻ */}
                      <TableRow>
                        <TableCell colSpan={4} className="font-semibold bg-green-100">
                          Đảng viên trẻ
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>1/</TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={platoon.r1Count}
                            onChange={(e) =>
                              updatePlatoonFee(index, "r1Count", Number(e.target.value))
                            }
                            disabled={isLocked}
                            className="w-24"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={platoon.r1Amount}
                            onChange={(e) =>
                              updatePlatoonFee(index, "r1Amount", Number(e.target.value))
                            }
                            disabled={isLocked}
                            className="w-32"
                          />
                        </TableCell>
                        <TableCell className="font-semibold">
                          {formatCurrency(platoon.r1Count * platoon.r1Amount)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>2/</TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={platoon.r2Count}
                            onChange={(e) =>
                              updatePlatoonFee(index, "r2Count", Number(e.target.value))
                            }
                            disabled={isLocked}
                            className="w-24"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={platoon.r2Amount}
                            onChange={(e) =>
                              updatePlatoonFee(index, "r2Amount", Number(e.target.value))
                            }
                            disabled={isLocked}
                            className="w-32"
                          />
                        </TableCell>
                        <TableCell className="font-semibold">
                          {formatCurrency(platoon.r2Count * platoon.r2Amount)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>3/</TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={platoon.r3Count}
                            onChange={(e) =>
                              updatePlatoonFee(index, "r3Count", Number(e.target.value))
                            }
                            disabled={isLocked}
                            className="w-24"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={platoon.r3Amount}
                            onChange={(e) =>
                              updatePlatoonFee(index, "r3Amount", Number(e.target.value))
                            }
                            disabled={isLocked}
                            className="w-32"
                          />
                        </TableCell>
                        <TableCell className="font-semibold">
                          {formatCurrency(platoon.r3Count * platoon.r3Amount)}
                        </TableCell>
                      </TableRow>
                      <TableRow className="bg-primary/10">
                        <TableCell colSpan={3} className="font-bold text-right">
                          Tổng {platoon.platoon}:
                        </TableCell>
                        <TableCell className="font-bold text-lg">
                          {formatCurrency(calculatePlatoonTotal(platoon))}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            ))}
            <div className="bg-primary/20 p-4 rounded-lg mt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">Tổng thu đoàn phí:</span>
                <span className="text-2xl font-bold text-primary">
                  {formatCurrency(totalPlatoonFees)}
                </span>
              </div>
            </div>
          </div>

          {/* Thu từ các hoạt động & Ngôi nhà 100 đồng */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Ngôi nhà 100 đồng */}
            <div className="bg-card p-6 rounded-lg border border-border">
              <h3 className="text-lg font-semibold mb-4">🏠 Ngôi nhà 100 đồng</h3>
              <div className="space-y-3">
                <div>
                  <Label>Số thành viên</Label>
                  <Input
                    type="number"
                    value={house100Count}
                    onChange={(e) => setHouse100Count(Number(e.target.value))}
                    disabled={isLocked}
                  />
                </div>
                <div>
                  <Label>Số tiền mỗi thành viên</Label>
                  <Input
                    type="number"
                    value={house100Amount}
                    onChange={(e) => setHouse100Amount(Number(e.target.value))}
                    disabled={isLocked}
                  />
                </div>
                <div className="bg-green-50 p-3 rounded">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Tổng:</span>
                    <span className="text-xl font-bold text-green-600">
                      {formatCurrency(totalHouse100)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Thu từ các hoạt động */}
            <div className="bg-card p-6 rounded-lg border border-border">
              <h3 className="text-lg font-semibold mb-4">🎯 Thu từ các hoạt động</h3>
              <div className="space-y-3">
                <div>
                  <Label>Số thành viên</Label>
                  <Input
                    type="number"
                    value={activityCount}
                    onChange={(e) => setActivityCount(Number(e.target.value))}
                    disabled={isLocked}
                  />
                </div>
                <div>
                  <Label>Số tiền mỗi thành viên</Label>
                  <Input
                    type="number"
                    value={activityAmount}
                    onChange={(e) => setActivityAmount(Number(e.target.value))}
                    disabled={isLocked}
                  />
                </div>
                <div className="bg-green-50 p-3 rounded">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Tổng:</span>
                    <span className="text-xl font-bold text-green-600">
                      {formatCurrency(totalActivity)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Các khoản thu cố định */}
          <div className="bg-card p-6 rounded-lg border border-border">
            <h2 className="text-2xl font-semibold mb-4">
              💈 Các khoản thu cố định
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-3">Tiền cắt tóc</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label>Số thành viên</Label>
                    <Input
                      type="number"
                      value={haircutCount}
                      onChange={(e) => setHaircutCount(Number(e.target.value))}
                      disabled={isLocked}
                    />
                  </div>
                  <div>
                    <Label>Số tiền mỗi thành viên</Label>
                    <Input
                      type="number"
                      value={haircutAmount}
                      onChange={(e) => setHaircutAmount(Number(e.target.value))}
                      disabled={isLocked}
                    />
                  </div>
                  <div className="bg-green-50 p-3 rounded flex items-end">
                    <div className="flex justify-between items-center w-full">
                      <span className="font-semibold">Tổng:</span>
                      <span className="text-xl font-bold text-green-600">
                        {formatCurrency(totalHaircut)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Các khoản thu khác */}
          <div className="bg-card p-6 rounded-lg border border-border">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">📝 Các khoản thu khác</h2>
              <Button
                onClick={handleAddOtherIncome}
                disabled={isLocked}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Thêm
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nội dung hoạt động</TableHead>
                  <TableHead>Số tiền</TableHead>
                  <TableHead>Mô tả tính toán</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {otherIncomes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                      Chưa có khoản thu nào
                    </TableCell>
                  </TableRow>
                ) : (
                  otherIncomes.map((income) => (
                    <TableRow key={income.id}>
                      <TableCell>{income.activity}</TableCell>
                      <TableCell className="font-semibold text-green-600">
                        {formatCurrency(income.amount)}
                      </TableCell>
                      <TableCell>{income.description}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditOtherIncome(income)}
                            disabled={isLocked}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteOtherIncome(income.id)}
                            disabled={isLocked}
                            className="hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            <div className="bg-green-50 p-4 rounded-lg mt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">Tổng thu khác:</span>
                <span className="text-2xl font-bold text-green-600">
                  {formatCurrency(totalOtherIncome)}
                </span>
              </div>
            </div>
          </div>

          {/* Các khoản chi */}
          <div className="bg-card p-6 rounded-lg border border-border">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">💸 Các khoản chi</h2>
              <Button
                onClick={handleAddExpense}
                disabled={isLocked}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Thêm khoản chi
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nội dung chi</TableHead>
                  <TableHead>Số tiền</TableHead>
                  <TableHead>Người chi</TableHead>
                  <TableHead>Người duyệt</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell>
                      <Input
                        value={expense.content}
                        onChange={(e) =>
                          updateExpense(expense.id, "content", e.target.value)
                        }
                        disabled={isLocked}
                        placeholder="Nội dung chi"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={expense.amount}
                        onChange={(e) =>
                          updateExpense(expense.id, "amount", Number(e.target.value))
                        }
                        disabled={isLocked}
                        placeholder="Số tiền"
                        className="w-32"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={expense.spender}
                        onChange={(e) =>
                          updateExpense(expense.id, "spender", e.target.value)
                        }
                        disabled={isLocked}
                        placeholder="Người chi"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={expense.approver}
                        onChange={(e) =>
                          updateExpense(expense.id, "approver", e.target.value)
                        }
                        disabled={isLocked}
                        placeholder="Người duyệt"
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteExpense(expense.id)}
                        disabled={isLocked}
                        className="hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="bg-red-50 p-4 rounded-lg mt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">Tổng chi:</span>
                <span className="text-2xl font-bold text-red-600">
                  {formatCurrency(totalExpense)}
                </span>
              </div>
            </div>
          </div>

          {/* Footer Summary */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-8 rounded-lg shadow-lg text-white">
              <div className="text-sm uppercase tracking-wide mb-2 opacity-90">
                Tổng nộp
              </div>
              <div className="text-4xl font-bold">{formatCurrency(totalToSubmit)}</div>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 p-8 rounded-lg shadow-lg text-white">
              <div className="text-sm uppercase tracking-wide mb-2 opacity-90">
                Quỹ còn lại chuyển tháng sau
              </div>
              <div className="text-4xl font-bold">
                {formatCurrency(remainingBalance)}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Other Income Dialog */}
      <OtherIncomeDialog
        open={showOtherIncomeDialog}
        onOpenChange={setShowOtherIncomeDialog}
        onSave={handleSaveOtherIncome}
        income={editingIncome}
      />
    </>
  );
}

// Other Income Dialog Component
interface OtherIncomeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (income: OtherIncome) => void;
  income: OtherIncome | null;
}

function OtherIncomeDialog({
  open,
  onOpenChange,
  onSave,
  income,
}: OtherIncomeDialogProps) {
  const [formData, setFormData] = useState({
    activity: "",
    amount: 0,
    description: "",
  });

  useState(() => {
    if (income) {
      setFormData({
        activity: income.activity,
        amount: income.amount,
        description: income.description,
      });
    } else {
      setFormData({
        activity: "",
        amount: 0,
        description: "",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: income?.id || Date.now().toString(),
      ...formData,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {income ? "Sửa khoản thu" : "Thêm khoản thu khác"}
          </DialogTitle>
          <DialogDescription>
            Nhập thông tin khoản thu
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="activity">Nội dung hoạt động</Label>
              <Input
                id="activity"
                value={formData.activity}
                onChange={(e) =>
                  setFormData({ ...formData, activity: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="amount">Số tiền</Label>
              <Input
                id="amount"
                type="number"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: Number(e.target.value) })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Mô tả tính toán</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
              />
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button type="submit">Lưu</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
