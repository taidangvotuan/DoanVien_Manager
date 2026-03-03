import { useState, useEffect } from "react";
import { MemberTable } from "../components/MemberTable";
import { MemberDialog, Member } from "../components/MemberDialog";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { UserPlus, Download, Search, Loader2 } from "lucide-react";
import { toast, Toaster } from "sonner";
import { apiService } from "../services/api";

export default function App() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const data = await apiService.getAllMembers();
      setMembers(data);
    } catch (error) {
      console.error(error);
      toast.error("Không thể tải danh sách đoàn viên");
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = () => {
    setDialogMode("add");
    setSelectedMember(null);
    setDialogOpen(true);
  };

  const handleEditMember = (member: Member) => {
    setDialogMode("edit");
    setSelectedMember(member);
    setDialogOpen(true);
  };

  const handleSaveMember = async (member: Member) => {
    try {
      if (dialogMode === "add") {
        const newMember = await apiService.createMember(member);
        setMembers([...members, newMember]);
        toast.success("Thêm đoàn viên thành công!");
      } else {
        const updatedMember = await apiService.updateMember(member.SoHieuQN.toString(), member);
        setMembers(members.map((m) => (m.SoHieuQN === updatedMember.SoHieuQN ? updatedMember : m)));
        toast.success("Cập nhật thông tin thành công!");
      }
      setDialogOpen(false);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Có lỗi xảy ra khi lưu thông tin");
    }
  };

  const handleDeleteMember = async (id: number) => {
    try {
      await apiService.deleteMember(id.toString());
      setMembers(members.filter((m) => m.SoHieuQN !== id));
      toast.success("Xóa đoàn viên thành công!");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Có lỗi xảy ra khi xóa đoàn viên");
    }
  };

  // Helper functions for CSV export
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

  const handleExport = async () => {
    try {
      const { exportToExcel } = await import("../utils/exportUtils");
      await exportToExcel(filteredMembers);
      toast.success("Xuất danh sách thành công!");
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra khi xuất danh sách");
    }
  };

  const filteredMembers = members.filter(
    (member) =>
      member.SoHieuQN.toString().includes(searchQuery) ||
      member.HoTen.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.CapBac.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.ChucVu.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.DonVi.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster position="top-right" richColors />

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="space-y-6">
          {/* Action Bar */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-card p-5 rounded-xl border border-border shadow-sm">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tên, số hiệu, đơn vị..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 rounded-lg"
              />
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleExport}
                className="gap-2 h-10 rounded-lg border-2"
                disabled={loading || members.length === 0}
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Xuất danh sách</span>
              </Button>
              <Button onClick={handleAddMember} className="gap-2 h-10 rounded-lg shadow-md bg-primary hover:bg-primary/90">
                <UserPlus className="h-4 w-4" />
                <span>Thêm Đoàn viên</span>
              </Button>
            </div>
          </div>

          {/* Members Table */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-card rounded-xl border border-dashed border-border">
              <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
              <p className="text-muted-foreground font-medium">Đang tải dữ liệu...</p>
            </div>
          ) : (
            <MemberTable
              members={filteredMembers}
              onEdit={handleEditMember}
              onDelete={handleDeleteMember}
            />
          )}

          {/* Results Count */}
          {!loading && searchQuery && (
            <p className="text-sm text-muted-foreground text-center animate-in fade-in slide-in-from-bottom-2">
              Hiển thị {filteredMembers.length} trong tổng số {members.length} Đoàn viên
            </p>
          )}
        </div>
      </main>

      {/* Member Dialog */}
      <MemberDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSaveMember}
        member={selectedMember}
        mode={dialogMode}
      />
    </div>
  );
}