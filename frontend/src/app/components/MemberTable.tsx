import { Member } from "./MemberDialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Button } from "./ui/button";
import { Pencil, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { useState, useMemo, Fragment } from "react";

interface MemberTableProps {
  members: Member[];
  onEdit: (member: Member) => void;
  onDelete: (id: number) => void;
}

const DON_VI_ORDER = [
  "CHỈ HUY ĐẠI ĐỘI",
  "TRUNG ĐỘI HL 1",
  "KHẨU ĐỘI 1",
  "KHẨU ĐỘI 2",
  "TRUNG ĐỘI HL 2",
  "KHẨU ĐỘI 3",
  "KHẨU ĐỘI 4"
];

// Helper function to format date from YYYY-MM-DD to DD/MM/YYYY
const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Helper function to format month from YYYY-MM-DD to MM/YYYY
const formatMonth = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${month}/${year}`;
};

export function MemberTable({ members, onEdit, onDelete }: MemberTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<number | null>(null);

  const handleDeleteClick = (id: number) => {
    setMemberToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (memberToDelete) {
      onDelete(memberToDelete);
      setDeleteDialogOpen(false);
      setMemberToDelete(null);
    }
  };

  const groupedMembers = useMemo(() => {
    const groups = DON_VI_ORDER.map(donVi => ({
      donVi,
      members: members.filter(m => m.DonVi === donVi)
    })).filter(group => group.members.length > 0);

    const otherMembers = members.filter(m => !DON_VI_ORDER.includes(m.DonVi));
    if (otherMembers.length > 0) {
      groups.push({
        donVi: "KHÁC",
        members: otherMembers
      });
    }

    return groups;
  }, [members]);

  return (
    <>
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/50 hover:bg-secondary/70">
                <TableHead className="min-w-[100px]">Số hiệu quân nhân</TableHead>
                <TableHead className="min-w-[150px]">Họ và tên</TableHead>
                <TableHead className="min-w-[120px]">Ngày sinh</TableHead>
                <TableHead className="min-w-[120px]">Ngày nhập ngũ</TableHead>
                <TableHead className="min-w-[80px]">Cấp bậc</TableHead>
                <TableHead className="min-w-[100px]">Chức vụ</TableHead>
                <TableHead className="min-w-[100px]">Đơn vị</TableHead>
                {/* <TableHead className="min-w-[150px]">Đơn vị đang quản lý</TableHead> */}
                <TableHead className="min-w-[100px]">Dân tộc</TableHead>
                <TableHead className="min-w-[100px]">Tôn giáo</TableHead>
                <TableHead className="min-w-[120px]">Trình độ văn hóa</TableHead>
                <TableHead className="min-w-[100px]">Vào Đảng/Đoàn</TableHead>
                <TableHead className="min-w-[150px]">Ngày vào Đảng/Đoàn</TableHead>
                <TableHead className="min-w-[150px]">Họ tên cha</TableHead>
                <TableHead className="min-w-[150px]">Họ tên mẹ</TableHead>
                <TableHead className="min-w-[150px]">Quê quán</TableHead>
                <TableHead className="min-w-[200px]">Nơi ở hiện nay</TableHead>
                <TableHead className="min-w-[120px]">Số điện thoại</TableHead>
                <TableHead className="min-w-[80px]">Nhóm máu</TableHead>
                <TableHead className="min-w-[120px]">CMND</TableHead>
                <TableHead className="min-w-[200px]">Phụ ghi</TableHead>
                <TableHead className="text-right min-w-[100px]">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groupedMembers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={22} className="text-center py-8 text-muted-foreground">
                    Không tìm thấy Đoàn viên. Thêm Đoàn viên đầu tiên để bắt đầu.
                  </TableCell>
                </TableRow>
              ) : (
                groupedMembers.map((group) => (
                  <Fragment key={group.donVi}>
                    <TableRow className="bg-muted/30 font-bold">
                      <TableCell colSpan={22} className="py-2 px-4 text-primary bg-primary/5">
                        {group.donVi} ({group.members.length})
                      </TableCell>
                    </TableRow>
                    {group.members.map((member) => (
                      <TableRow key={member.SoHieuQN} className="hover:bg-accent/50">
                        <TableCell>{member.SoHieuQN}</TableCell>
                        <TableCell className="font-medium">{member.HoTen}</TableCell>
                        <TableCell>{formatDate(member.NgaySinh)}</TableCell>
                        <TableCell>{formatMonth(member.NgayNhapNgu)}</TableCell>
                        <TableCell>{member.CapBac}</TableCell>
                        <TableCell>{member.ChucVu}</TableCell>
                        <TableCell>{member.DonVi}</TableCell>
                        {/* <TableCell>{member.DonViDangQuanLy && member.DonViDangQuanLy !== 'none' ? member.DonViDangQuanLy : ""}</TableCell> */}
                        <TableCell>{member.DanToc}</TableCell>
                        <TableCell>{member.TonGiao}</TableCell>
                        <TableCell>{member.TrinhDoVanHoa}</TableCell>
                        <TableCell>{member.VaoDangDoan}</TableCell>
                        <TableCell>{formatDate(member.NgayVaoDangDoan)}</TableCell>
                        <TableCell>{member.HoTenCha}</TableCell>
                        <TableCell>{member.HoTenMe}</TableCell>
                        <TableCell>{member.QueQuan}</TableCell>
                        <TableCell>{member.NoiOHienNay}</TableCell>
                        <TableCell>{member.SDT}</TableCell>
                        <TableCell>{member.NhomMau}</TableCell>
                        <TableCell>{member.CMND}</TableCell>
                        <TableCell>{member.PhuGhi}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onEdit(member)}
                              className="hover:bg-accent"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteClick(member.SoHieuQN)}
                              className="hover:bg-destructive/10 hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </Fragment>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xóa Đoàn viên này?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Đoàn viên này sẽ bị xóa vĩnh viễn.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}