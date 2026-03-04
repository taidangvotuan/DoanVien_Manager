import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";

export interface Member {
  SoHieuQN: number; // INTEGER primary key
  HoTen: string; // STRING(100), NOT NULL
  NgaySinh: string; // DATEONLY (YYYY-MM-DD), NOT NULL
  NgayNhapNgu: string; // DATEONLY (YYYY-MM), NOT NULL
  CapBac: string; // STRING(3), NOT NULL
  ChucVu: string; // STRING(10), NOT NULL
  DonVi: string; // STRING(50), NOT NULL
  DonViDangQuanLy?: string; // STRING(50), NULLABLE
  DanToc: string; // STRING(15), NOT NULL
  TonGiao: string; // STRING(10), NOT NULL
  TrinhDoVanHoa: string; // STRING(10), NOT NULL
  VaoDangDoan: "Đảng" | "Đoàn" | ""; // ENUM, NOT NULL
  NgayVaoDangDoan: string; // DATEONLY (YYYY-MM-DD), NULLABLE
  HoTenCha: string; // STRING(100), NULLABLE
  HoTenMe: string; // STRING(100), NULLABLE
  QueQuan: string; // STRING(20), NOT NULL
  NoiOHienNay: string; // STRING(250), NOT NULL
  SDT: string; // STRING(10), digits only, starts with 0, NOT NULL
  NhomMau: string; // STRING(3), NULLABLE
  CMND: string; // STRING(12), digits only, starts with 0, NULLABLE
  PhuGhi: string; // STRING(500), NULLABLE
}

interface MemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (member: Member) => void;
  member?: Member | null;
  mode: "add" | "edit";
}

export function MemberDialog({
  open,
  onOpenChange,
  onSave,
  member,
  mode,
}: MemberDialogProps) {
  const [formData, setFormData] = useState<Member>({
    SoHieuQN: 0,
    HoTen: "",
    NgaySinh: "",
    NgayNhapNgu: "",
    CapBac: "",
    ChucVu: "",
    DonVi: "",
    DonViDangQuanLy: "",
    DanToc: "",
    TonGiao: "",
    TrinhDoVanHoa: "",
    VaoDangDoan: "",
    NgayVaoDangDoan: "",
    HoTenCha: "",
    HoTenMe: "",
    QueQuan: "",
    NoiOHienNay: "",
    SDT: "",
    NhomMau: "",
    CMND: "",
    PhuGhi: "",
  });
  const NgayHienTai: Date = new Date();
  NgayHienTai.setHours(0, 0, 0, 0);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (member && mode === "edit") {
      setFormData({
        SoHieuQN: member.SoHieuQN,
        HoTen: member.HoTen,
        NgaySinh: member.NgaySinh,
        NgayNhapNgu: member.NgayNhapNgu,
        CapBac: member.CapBac,
        ChucVu: member.ChucVu,
        DonVi: member.DonVi,
        DonViDangQuanLy: member.DonViDangQuanLy || "",
        DanToc: member.DanToc,
        TonGiao: member.TonGiao,
        TrinhDoVanHoa: member.TrinhDoVanHoa,
        VaoDangDoan: member.VaoDangDoan,
        NgayVaoDangDoan: member.NgayVaoDangDoan,
        HoTenCha: member.HoTenCha,
        HoTenMe: member.HoTenMe,
        QueQuan: member.QueQuan,
        NoiOHienNay: member.NoiOHienNay,
        SDT: member.SDT,
        NhomMau: member.NhomMau,
        CMND: member.CMND,
        PhuGhi: member.PhuGhi,
      });
    } else if (mode === "add") {
      setFormData({
        SoHieuQN: 0,
        HoTen: "",
        NgaySinh: "",
        NgayNhapNgu: "",
        CapBac: "",
        ChucVu: "",
        DonVi: "",
        DonViDangQuanLy: "",
        DanToc: "",
        TonGiao: "",
        TrinhDoVanHoa: "",
        VaoDangDoan: "",
        NgayVaoDangDoan: "",
        HoTenCha: "",
        HoTenMe: "",
        QueQuan: "",
        NoiOHienNay: "",
        SDT: "",
        NhomMau: "",
        CMND: "",
        PhuGhi: "",
      });
    }
    setErrors({});
  }, [member, mode, open]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.SoHieuQN || isNaN(Number(formData.SoHieuQN))) {
      newErrors.SoHieuQN = "Số hiệu quân nhân là bắt buộc và phải là số";
    }
    if (!formData.HoTen || formData.HoTen.length > 100) {
      newErrors.HoTen = "Tên đầy đủ là bắt buộc (khoảng 100 ký tự)";
    }
    if (!formData.NgaySinh) {
      newErrors.NgaySinh = "Ngày sinh là bắt buộc";
    }
    if (formData.NgaySinh) {
      const ngaySinhDate = new Date(formData.NgaySinh);
      ngaySinhDate.setHours(0, 0, 0, 0);
      
      if (ngaySinhDate >= NgayHienTai) {
        newErrors.NgaySinh = "Ngày sinh phải nhỏ hơn ngày hiện tại";
      }
    }
    if (!formData.NgayNhapNgu) {
      newErrors.NgayNhapNgu = "Ngày nhập ngũ là bắt buộc";
    }
    if (formData.NgayNhapNgu) {
      const ngayNhapNgu = new Date(formData.NgayNhapNgu);
      ngayNhapNgu.setHours(0, 0, 0, 0);
      
      if (ngayNhapNgu >= NgayHienTai) {
      newErrors.NgayNhapNgu = "Ngày nhập ngũ phải nhỏ hơn ngày hiện tại";
      }
    }
    if (!formData.CapBac || formData.CapBac.length > 3) {
      newErrors.CapBac = "Cấp bậc là bắt buộc (khoảng 3 ký tự)";
    }
    if (!formData.ChucVu || formData.ChucVu.length > 10) {
      newErrors.ChucVu = "Chức vụ là bắt buộc (khoảng 10 ký tự)";
    }
    if (!formData.DonVi || formData.DonVi.length > 20) {
      newErrors.DonVi = "Đơn vị là bắt buộc (khoảng 20 ký tự)";
    }
    if (!formData.DanToc || formData.DanToc.length > 15) {
      newErrors.DanToc = "Dân tộc là bắt buộc (khoảng 15 ký tự)";
    }
    if (!formData.TonGiao || formData.TonGiao.length > 10) {
      newErrors.TonGiao = "Tôn giáo là bắt buộc (khoảng 10 ký tự)";
    }
    if (!formData.TrinhDoVanHoa || formData.TrinhDoVanHoa.length > 10) {
      newErrors.TrinhDoVanHoa = "Trình độ văn hóa là bắt buộc (khoảng 10 ký tự)";
    }
    if (!formData.VaoDangDoan) {
      newErrors.VaoDangDoan = "Vào Đảng/Đoàn là bắt buộc";
    }
    if (formData.NgayVaoDangDoan) {
      const ngayVaoDangDoan = new Date(formData.NgayVaoDangDoan);
      ngayVaoDangDoan.setHours(0, 0, 0, 0);
      
      if (ngayVaoDangDoan >= NgayHienTai) {
        newErrors.NgayVaoDangDoan = "Ngày vào Đảng/Đoàn phải nhỏ hơn ngày hiện tại";
      }
    }
    if (!formData.QueQuan || formData.QueQuan.length > 20) {
      newErrors.QueQuan = "Quê quán là bắt buộc (khoảng 20 ký tự)";
    }
    if (!formData.NoiOHienNay || formData.NoiOHienNay.length > 250) {
      newErrors.NoiOHienNay = "Nơi ở hiện nay là bắt buộc (khoảng 250 ký tự)";
    }
    if (!formData.SDT) {
      newErrors.SDT = "Số điện thoại là bắt buộc";
    } else if (!/^0\d{9}$/.test(formData.SDT)) {
      newErrors.SDT = "Số điện thoại phải có 10 chữ số và bắt đầu bằng số 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Thêm Đoàn viên" : "Chỉnh sửa thông tin Đoàn viên"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Nhập thông tin để thêm Đoàn viên vào tổ chức."
              : "Cập nhật thông tin Đoàn viên."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="SoHieuQN">Số hiệu quân nhân<span style={{color: 'red'}}>*</span></Label>
              <Input
                id="SoHieuQN"
                type="number"
                value={formData.SoHieuQN || ""}
                onChange={(e) =>
                  setFormData({ ...formData, SoHieuQN: parseInt(e.target.value) || 0 })
                }
                placeholder="1001"
                disabled={mode === "edit"}
                required
              />
              {errors.SoHieuQN && <p className="text-red-500 text-sm">{errors.SoHieuQN}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="HoTen">Họ và tên<span style={{color: 'red'}}>*</span></Label>
              <Input
                id="HoTen"
                value={formData.HoTen}
                onChange={(e) =>
                  setFormData({ ...formData, HoTen: e.target.value })
                }
                placeholder="Nguyễn Văn A"
                required
              />
              {errors.HoTen && <p className="text-red-500 text-sm">{errors.HoTen}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="NgaySinh">Ngày, tháng, năm sinh<span style={{color: 'red'}}>*</span></Label>
              <Input
                id="NgaySinh"
                type="date"
                value={formData.NgaySinh}
                onChange={(e) =>
                  setFormData({ ...formData, NgaySinh: e.target.value })
                }
                required
              />
              {errors.NgaySinh && <p className="text-red-500 text-sm">{errors.NgaySinh}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="NgayNhapNgu">Nhập ngũ<span style={{color: 'red'}}>*</span></Label>
              <Input
                id="NgayNhapNgu"
                type="date"
                value={formData.NgayNhapNgu}
                onChange={(e) =>
                  setFormData({ ...formData, NgayNhapNgu: e.target.value })
                }
                required
              />
              {errors.NgayNhapNgu && <p className="text-red-500 text-sm">{errors.NgayNhapNgu}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="CapBac">Cấp bậc<span style={{color: 'red'}}>*</span></Label>
              <Input
                id="CapBac"
                value={formData.CapBac}
                onChange={(e) =>
                  setFormData({ ...formData, CapBac: e.target.value })
                }
                placeholder="H1"
                required
              />
              {errors.CapBac && <p className="text-red-500 text-sm">{errors.CapBac}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="ChucVu">Chức vụ<span style={{color: 'red'}}>*</span></Label>
              <Input
                id="ChucVu"
                value={formData.ChucVu}
                onChange={(e) =>
                  setFormData({ ...formData, ChucVu: e.target.value })
                }
                placeholder="ct"
                required
              />
              {errors.ChucVu && <p className="text-red-500 text-sm">{errors.ChucVu}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="DonVi">Đơn vị<span style={{color: 'red'}}>*</span></Label>
              <Select
                value={formData.DonVi}
                onValueChange={(value) =>
                  setFormData({ ...formData, DonVi: value })
                }
              >
                <SelectTrigger id="DonVi">
                  <SelectValue placeholder="Chọn đơn vị" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CHỈ HUY ĐẠI ĐỘI">CHỈ HUY ĐẠI ĐỘI</SelectItem>
                  <SelectItem value="TRUNG ĐỘI HL 1">TRUNG ĐỘI HL 1</SelectItem>
                  <SelectItem value="KHẨU ĐỘI 1">KHẨU ĐỘI 1</SelectItem>
                  <SelectItem value="KHẨU ĐỘI 2">KHẨU ĐỘI 2</SelectItem>
                  <SelectItem value="TRUNG ĐỘI HL 2">TRUNG ĐỘI HL 2</SelectItem>
                  <SelectItem value="KHẨU ĐỘI 3">KHẨU ĐỘI 3</SelectItem>
                  <SelectItem value="KHẨU ĐỘI 4">KHẨU ĐỘI 4</SelectItem>
                </SelectContent>
              </Select>
              {errors.DonVi && <p className="text-red-500 text-sm">{errors.DonVi}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="DonViDangQuanLy">Đơn vị đang quản lý</Label>
              <Select
                value={formData.DonViDangQuanLy}
                onValueChange={(value) =>
                  setFormData({ ...formData, DonViDangQuanLy: value })
                }
              >
                <SelectTrigger id="DonViDangQuanLy">
                  <SelectValue placeholder="Chọn đơn vị đang quản lý" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Không có</SelectItem>
                  <SelectItem value="CHỈ HUY ĐẠI ĐỘI">CHỈ HUY ĐẠI ĐỘI</SelectItem>
                  <SelectItem value="TRUNG ĐỘI HL 1">TRUNG ĐỘI HL 1</SelectItem>
                  <SelectItem value="KHẨU ĐỘI 1">KHẨU ĐỘI 1</SelectItem>
                  <SelectItem value="KHẨU ĐỘI 2">KHẨU ĐỘI 2</SelectItem>
                  <SelectItem value="TRUNG ĐỘI HL 2">TRUNG ĐỘI HL 2</SelectItem>
                  <SelectItem value="KHẨU ĐỘI 3">KHẨU ĐỘI 3</SelectItem>
                  <SelectItem value="KHẨU ĐỘI 4">KHẨU ĐỘI 4</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="DanToc">Dân tộc<span style={{color: 'red'}}>*</span></Label>
              <Input
                id="DanToc"
                value={formData.DanToc}
                onChange={(e) =>
                  setFormData({ ...formData, DanToc: e.target.value })
                }
                placeholder="Kinh"
                required
              />
              {errors.DanToc && <p className="text-red-500 text-sm">{errors.DanToc}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="TonGiao">Tôn giáo<span style={{color: 'red'}}>*</span></Label>
              <Input
                id="TonGiao"
                value={formData.TonGiao}
                onChange={(e) =>
                  setFormData({ ...formData, TonGiao: e.target.value })
                }
                placeholder="Buddhism"
                required
              />
              {errors.TonGiao && <p className="text-red-500 text-sm">{errors.TonGiao}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="TrinhDoVanHoa">Văn hóa<span style={{color: 'red'}}>*</span></Label>
              <Input
                id="TrinhDoVanHoa"
                value={formData.TrinhDoVanHoa}
                onChange={(e) =>
                  setFormData({ ...formData, TrinhDoVanHoa: e.target.value })
                }
                placeholder="Văn hóa"
                required
              />
              {errors.TrinhDoVanHoa && <p className="text-red-500 text-sm">{errors.TrinhDoVanHoa}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="VaoDangDoan">Đảng/Đoàn<span style={{color: 'red'}}>*</span></Label>
              <Select
                value={formData.VaoDangDoan}
                onValueChange={(value: "Đảng" | "Đoàn" | "") =>
                  setFormData({ ...formData, VaoDangDoan: value })
                }
              >
                <SelectTrigger id="VaoDangDoan">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Đảng">Đảng</SelectItem>
                  <SelectItem value="Đoàn">Đoàn</SelectItem>
                </SelectContent>
              </Select>
              {errors.VaoDangDoan && <p className="text-red-500 text-sm">{errors.VaoDangDoan}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="NgayVaoDangDoan">Ngày vào Đảng/Đoàn</Label>
              <Input
                id="NgayVaoDangDoan"
                type="date"
                value={formData.NgayVaoDangDoan}
                onChange={(e) =>
                  setFormData({ ...formData, NgayVaoDangDoan: e.target.value })
                }
              />
              {errors.NgayVaoDangDoan && <p className="text-red-500 text-sm">{errors.NgayVaoDangDoan}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="HoTenCha">Họ tên cha</Label>
              <Input
                id="HoTenCha"
                value={formData.HoTenCha}
                onChange={(e) =>
                  setFormData({ ...formData, HoTenCha: e.target.value })
                }
                placeholder="Họ tên cha"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="HoTenMe">Họ tên mẹ</Label>
              <Input
                id="HoTenMe"
                value={formData.HoTenMe}
                onChange={(e) =>
                  setFormData({ ...formData, HoTenMe: e.target.value })
                }
                placeholder="Họ tên mẹ"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="QueQuan">Quê quán<span style={{color: 'red'}}>*</span></Label>
              <Input
                id="QueQuan"
                value={formData.QueQuan}
                onChange={(e) =>
                  setFormData({ ...formData, QueQuan: e.target.value })
                }
                placeholder="Quê quán"
                required
              />
              {errors.QueQuan && <p className="text-red-500 text-sm">{errors.QueQuan}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="NoiOHienNay">Nơi ở hiện nay<span style={{color: 'red'}}>*</span></Label>
              <Textarea
                id="NoiOHienNay"
                value={formData.NoiOHienNay}
                onChange={(e) =>
                  setFormData({ ...formData, NoiOHienNay: e.target.value })
                }
                placeholder="Nơi ở hiện nay"
                required
              />
              {errors.NoiOHienNay && <p className="text-red-500 text-sm">{errors.NoiOHienNay}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="SDT">Số điện thoại<span style={{color: 'red'}}>*</span></Label>
              <Input
                id="SDT"
                value={formData.SDT}
                onChange={(e) =>
                  setFormData({ ...formData, SDT: e.target.value })
                }
                placeholder="0912345678"
                required
              />
              {errors.SDT && <p className="text-red-500 text-sm">{errors.SDT}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="NhomMau">Nhóm máu</Label>
              <Input
                id="NhomMau"
                value={formData.NhomMau}
                onChange={(e) =>
                  setFormData({ ...formData, NhomMau: e.target.value })
                }
                placeholder="A"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="CMND">Số CMND</Label>
              <Input
                id="CMND"
                value={formData.CMND}
                onChange={(e) =>
                  setFormData({ ...formData, CMND: e.target.value })
                }
                placeholder="001095012345"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="PhuGhi">Phụ ghi</Label>
              <Textarea
                id="PhuGhi"
                value={formData.PhuGhi}
                onChange={(e) =>
                  setFormData({ ...formData, PhuGhi: e.target.value })
                }
                placeholder="Nhập ghi chú thêm nếu có"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Hủy
            </Button>
            <Button type="submit">
              {mode === "add" ? "Thêm đoàn viên" : "Lưu thay đổi"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}