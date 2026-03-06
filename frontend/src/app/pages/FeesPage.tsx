import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { exportToWord } from "../utils/exportWordUtils";
import { Lock, LockOpen, Download, Save, Plus, Trash2, Edit2, List } from "lucide-react";
import { toast, Toaster } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} 
from "../components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,} 
from "../components/ui/dialog";
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

  // Thu từ các hoạt động
  const [activities, setActivities] = useState<Activity[]>([
    // {
    //   id: "1",
    //   name: "Hoạt động văn nghệ",
    //   memberCount: 30,
    //   amountPerMember: 50000,
    // },
  ]);

  // Các khoản thu cố định
  const [fixedIncomes, setFixedIncomes] = useState<FixedIncome[]>([
    // {
    //   id: "1",
    //   name: "Tiền cắt tóc",
    //   memberCount: 28,
    //   amountPerMember: 20000,
    // },
  ]);

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
    // {
    //   id: "1",
    //   content: "Mua nước",
    //   amount: 200000,
    //   spender: "Nguyễn Văn A",
    //   approver: "Trần Văn B",
    // },
  ]);

  // Dialog states
  const [showActivityDialog, setShowActivityDialog] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [showFixedIncomeDialog, setShowFixedIncomeDialog] = useState(false);
  const [editingFixedIncome, setEditingFixedIncome] = useState<FixedIncome | null>(null);
  const [showOtherIncomeDialog, setShowOtherIncomeDialog] = useState(false);
  const [editingIncome, setEditingIncome] = useState<OtherIncome | null>(null);
  const [showExpenseDialog, setShowExpenseDialog] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  // Historical data — now mutable so handleSave can append to it
  const [monthlySummaries, setMonthlySummaries] = useState<MonthlySummary[]>([]);

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

  const totalActivities = activities.reduce((sum, a) => sum + a.memberCount * a.amountPerMember, 0);
  const totalFixedIncomes = fixedIncomes.reduce((sum, f) => sum + f.memberCount * f.amountPerMember, 0);
  const totalOtherIncome = otherIncomes.reduce((sum, i) => sum + i.amount, 0);

  const totalIncome = totalPlatoonFees + totalActivities + totalFixedIncomes 
  + previousBalance + totalOtherIncome;

  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalToSubmit = totalIncome - totalExpense;
  const remainingBalance = totalToSubmit;

  // Handlers
  const handleLockToggle = () => {
    setIsLocked(!isLocked);
    toast.success(isLocked ? "Đã mở khóa chỉnh sửa" : "Đã khóa chỉnh sửa");
  };

  const handleSave = () => {
    const newSummary: MonthlySummary = {
      month: currentMonth,
      totalIncome,
      totalExpense,
      balance: remainingBalance,
      isLocked,
    };

    setMonthlySummaries((prev) => {
      // Replace existing entry for same month, or append new one
      const exists = prev.findIndex((s) => s.month === currentMonth);
      if (exists !== -1) {
        const updated = [...prev];
        updated[exists] = newSummary;
        return updated;
      }
      return [...prev, newSummary];
    });

    // Auto-open the summary list so the user sees the saved row
    setShowSummaryList(true);
    toast.success("Đã lưu bản ghi thành công!");
  };

  const handleExportWord = async () => {
    try {
      await exportToWord({
        currentMonth, platoonFees, activities, fixedIncomes,
        previousBalance, otherIncomes, expenses,
      });
      toast.success("Xuất báo cáo thành công!");
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra khi xuất file Word!");
    }
  };

// Activity handlers
  const handleAddActivity = () => {
    setEditingActivity(null);
    setShowActivityDialog(true);
  };

  const handleEditActivity = (activity: Activity) => {
    setEditingActivity(activity);
    setShowActivityDialog(true);
  };

  const handleDeleteActivity = (id: string) => {
    setActivities(activities.filter((a) => a.id !== id));
    toast.success("Đã xóa hoạt động");
  };

  const handleSaveActivity = (activity: Activity) => {
    if (editingActivity) {
      setActivities(
        activities.map((a) => (a.id === activity.id ? activity : a))
      );
      toast.success("Đã cập nhật hoạt động");
    } else {
      setActivities([...activities, { ...activity, id: Date.now().toString() }]);
      toast.success("Đã thêm hoạt động");
    }
    setShowActivityDialog(false);
  };

  // Fixed Income handlers
  const handleAddFixedIncome = () => {
    setEditingFixedIncome(null);
    setShowFixedIncomeDialog(true);
  };

  const handleEditFixedIncome = (fixedIncome: FixedIncome) => {
    setEditingFixedIncome(fixedIncome);
    setShowFixedIncomeDialog(true);
  };

  const handleDeleteFixedIncome = (id: string) => {
    setFixedIncomes(fixedIncomes.filter((f) => f.id !== id));
    toast.success("Đã xóa khoản thu cố định");
  };

  const handleSaveFixedIncome = (fixedIncome: FixedIncome) => {
    if (editingFixedIncome) {
      setFixedIncomes(
        fixedIncomes.map((f) => (f.id === fixedIncome.id ? fixedIncome : f))
      );
      toast.success("Đã cập nhật khoản thu cố định");
    } else {
      setFixedIncomes([...fixedIncomes, { ...fixedIncome, id: Date.now().toString() }]);
      toast.success("Đã thêm khoản thu cố định");
    }
    setShowFixedIncomeDialog(false);
  };

  // Other Income handlers
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

  // Expense
  const handleAddExpense = () => {
    setEditingExpense(null);
    setShowExpenseDialog(true);
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setShowExpenseDialog(true);
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter((e) => e.id !== id));
    toast.success("Đã xóa khoản chi");
  };

  const handleSaveExpense = (expense: Expense) => {
    if (editingExpense) {
      setExpenses(
        expenses.map((e) => (e.id === expense.id ? expense : e))
      );
      toast.success("Đã cập nhật khoản chi");
    } else {
      setExpenses([...expenses, { ...expense, id: Date.now().toString() }]);
      toast.success("Đã thêm khoản chi");
    }
    setShowExpenseDialog(false);
  };

  const updatePlatoonFee = (index: number, field: keyof PlatoonFee, value: number) => {
    const newPlatoonFees = [...platoonFees];
    (newPlatoonFees[index] as any)[field] = value;
    setPlatoonFees(newPlatoonFees);
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

          {/* Thu từ các hoạt động */}
          <div className="bg-card p-6 rounded-lg border border-border">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">🎯 Thu từ các hoạt động</h2>
              <Button
                onClick={handleAddActivity}
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
                  <TableHead>Tên hoạt động</TableHead>
                  <TableHead>Số thành viên</TableHead>
                  <TableHead>Số tiền mỗi thành viên</TableHead>
                  <TableHead>Tổng</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activities.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      Chưa có hoạt động nào
                    </TableCell>
                  </TableRow>
                ) : (
                  activities.map((activity) => (
                    <TableRow key={activity.id}>
                      <TableCell className="font-medium">{activity.name}</TableCell>
                      <TableCell>{activity.memberCount}</TableCell>
                      <TableCell>{formatCurrency(activity.amountPerMember)}</TableCell>
                      <TableCell className="font-semibold text-green-600">
                        {formatCurrency(activity.memberCount * activity.amountPerMember)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditActivity(activity)}
                            disabled={isLocked}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteActivity(activity.id)}
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
                <span className="text-lg font-bold">Tổng:</span>
                <span className="text-2xl font-bold text-green-600">
                  {formatCurrency(totalActivities)}
                </span>
              </div>
            </div>
          </div>

          {/* Các khoản thu cố định */}
          <div className="bg-card p-6 rounded-lg border border-border">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">
                💈 Các khoản thu cố định
              </h2>
              <Button
                onClick={handleAddFixedIncome}
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
                  <TableHead>Tên khoản thu cố định</TableHead>
                  <TableHead>Số thành viên</TableHead>
                  <TableHead>Số tiền mỗi thành viên</TableHead>
                  <TableHead>Tổng</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fixedIncomes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      Chưa có khoản thu cố định nào
                    </TableCell>
                  </TableRow>
                ) : (
                  fixedIncomes.map((fixedIncome) => (
                    <TableRow key={fixedIncome.id}>
                      <TableCell className="font-medium">{fixedIncome.name}</TableCell>
                      <TableCell>{fixedIncome.memberCount}</TableCell>
                      <TableCell>{formatCurrency(fixedIncome.amountPerMember)}</TableCell>
                      <TableCell className="font-semibold text-green-600">
                        {formatCurrency(fixedIncome.memberCount * fixedIncome.amountPerMember)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditFixedIncome(fixedIncome)}
                            disabled={isLocked}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteFixedIncome(fixedIncome.id)}
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
                <span className="text-lg font-bold">Tổng:</span>
                <span className="text-2xl font-bold text-green-600">
                  {formatCurrency(totalFixedIncomes)}
                </span>
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
                Thêm
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
                {expenses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      Chưa có khoản chi nào
                    </TableCell>
                  </TableRow>
                ) : (
                  expenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell>{expense.content}</TableCell>
                      <TableCell className="font-semibold text-red-600">
                        {formatCurrency(expense.amount)}
                      </TableCell>
                      <TableCell>{expense.spender}</TableCell>
                      <TableCell>{expense.approver}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditExpense(expense)}
                            disabled={isLocked}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteExpense(expense.id)}
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

    {/* Activity Dialog */}
      <ActivityDialog
        open={showActivityDialog}
        onOpenChange={setShowActivityDialog}
        onSave={handleSaveActivity}
        activity={editingActivity}
      />

      {/* Fixed Income Dialog */}
      <FixedIncomeDialog
        open={showFixedIncomeDialog}
        onOpenChange={setShowFixedIncomeDialog}
        onSave={handleSaveFixedIncome}
        fixedIncome={editingFixedIncome}
      />

      {/* Other Income Dialog */}
      <OtherIncomeDialog
        open={showOtherIncomeDialog}
        onOpenChange={setShowOtherIncomeDialog}
        onSave={handleSaveOtherIncome}
        income={editingIncome}
      />

      {/* Expense Dialog */}
      <ExpenseDialog
        open={showExpenseDialog}
        onOpenChange={setShowExpenseDialog}
        onSave={handleSaveExpense}
        expense={editingExpense}
      />
    </>
  );
}

interface ActivityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (activity: Activity) => void;
  activity: Activity | null;
}

function ActivityDialog({
  open,
  onOpenChange,
  onSave,
  activity,
}: ActivityDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    memberCount: 0,
    amountPerMember: 0,
  });

  useState(() => {
    if (activity) {
      setFormData({
        name: activity.name,
        memberCount: activity.memberCount,
        amountPerMember: activity.amountPerMember,
      });
    } else {
      setFormData({
        name: "",
        memberCount: 0,
        amountPerMember: 0,
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: activity?.id || Date.now().toString(),
      ...formData,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {activity ? "Sửa hoạt động" : "Thêm hoạt động"}
          </DialogTitle>
          <DialogDescription>
            Nhập thông tin hoạt động
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Tên hoạt động<span style={{color: 'red'}}>*</span></Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="memberCount">Số thành viên</Label>
              <Input
                id="memberCount"
                type="number"
                value={formData.memberCount}
                onChange={(e) =>
                  setFormData({ ...formData, memberCount: Number(e.target.value) })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="amountPerMember">Số tiền mỗi thành viên</Label>
              <Input
                id="amountPerMember"
                type="number"
                value={formData.amountPerMember}
                onChange={(e) =>
                  setFormData({ ...formData, amountPerMember: Number(e.target.value) })
                }
                required
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

// Fixed Income Dialog Component
interface FixedIncomeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (fixedIncome: FixedIncome) => void;
  fixedIncome: FixedIncome | null;
}

function FixedIncomeDialog({
  open,
  onOpenChange,
  onSave,
  fixedIncome,
}: FixedIncomeDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    memberCount: 0,
    amountPerMember: 0,
  });

  useState(() => {
    if (fixedIncome) {
      setFormData({
        name: fixedIncome.name,
        memberCount: fixedIncome.memberCount,
        amountPerMember: fixedIncome.amountPerMember,
      });
    } else {
      setFormData({
        name: "",
        memberCount: 0,
        amountPerMember: 0,
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: fixedIncome?.id || Date.now().toString(),
      ...formData,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {fixedIncome ? "Sửa khoản thu cố định" : "Thêm khoản thu cố định"}
          </DialogTitle>
          <DialogDescription>
            Nhập thông tin khoản thu cố định
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Tên khoản thu cố định<span style={{color: 'red'}}>*</span></Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="memberCount">Số thành viên</Label>
              <Input
                id="memberCount"
                type="number"
                value={formData.memberCount}
                onChange={(e) =>
                  setFormData({ ...formData, memberCount: Number(e.target.value) })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="amountPerMember">Số tiền mỗi thành viên</Label>
              <Input
                id="amountPerMember"
                type="number"
                value={formData.amountPerMember}
                onChange={(e) =>
                  setFormData({ ...formData, amountPerMember: Number(e.target.value) })
                }
                required
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
              <Label htmlFor="activity">Nội dung hoạt động<span style={{color: 'red'}}>*</span></Label>
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

// Expense Dialog Component
interface ExpenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (expense: Expense) => void;
  expense: Expense | null;
}

function ExpenseDialog({
  open, onOpenChange, onSave, expense,
}: ExpenseDialogProps) {
  const [formData, setFormData] = useState({
    content: "",
    amount: 0,
    spender: "",
    approver: "",
  });

  useState(() => {
    if (expense) {
      setFormData({
        content: expense.content,
        amount: expense.amount,
        spender: expense.spender,
        approver: expense.approver,
      });
    } else {
      setFormData({
        content: "",
        amount: 0,
        spender: "",
        approver: "",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: expense?.id || Date.now().toString(),
      ...formData,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {expense ? "Sửa khoản chi" : "Thêm khoản chi"}
          </DialogTitle>
          <DialogDescription>
            Nhập thông tin khoản chi
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="content">Nội dung chi<span style={{color: 'red'}}>*</span></Label>
              <Input
                id="content"
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
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
              <Label htmlFor="spender">Người chi<span style={{color: 'red'}}>*</span></Label>
              <Input
                id="spender"
                value={formData.spender}
                onChange={(e) =>
                  setFormData({ ...formData, spender: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="approver">Người duyệt<span style={{color: 'red'}}>*</span></Label>
              <Input
                id="approver"
                value={formData.approver}
                onChange={(e) =>
                  setFormData({ ...formData, approver: e.target.value })
                }
                required
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
