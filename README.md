# QUẢN LÝ ĐOÀN VIÊN
Phần mềm giúp cho việc quản lý thông tin đoàn viên và thu chi trở nên dễ dàng hơn.
## Cách khởi động
**1. Cài đặt Visual Studio Code**
+ B1: Vào trang web này: __https://code.visualstudio.com/download__ rồi nhấn vào Windows để tải xuống.
+ B2:Sau đó, nhấn vào file __VSCodeUserSetup-x64-1.109.5.exe__ vừa tải.
+ B3: Tiếp tục chọn __I accept the agreement__ rồi nhấn __Next__ liên tục 3 lần.
+ B4: Sau đó tích vào __Create a desktop icon__ (nếu chưa tích) rồi nhấn __Next__ và bấm __Install__.
+ B5: Sau khi tải xuống nhấn __Finish__.

**2. Chạy phần mềm Quản lý đoàn viên**
+ B1: Mở Visual Studio Code
+ B2: Lấy file .zip tải về từ link
+ B3: Giải nén file đó rồi mở thư mục DoanVien_Manager
+ B4: Thực hiện các lệnh sau để chạy phần mềm:
```
npm install
npm run dev
```
## Các tính năng quản lý thông tin đoàn viên (Nhấn vào mục "Quản lý đoàn viên" ở đầu màn hình)
**1. Nhập đoàn viên mới**
+ B1: Nhấn vào nút __Thêm đoàn viên__.
+ B2: Nhập đầy đủ thông tin đoàn viên (Những trường thông tin đánh dẫu * là bắt buộc)
+ B3: Nhấn __Thêm đoàn viên__ để hoàn thành.

**2. Sửa thông tin đoàn viên**
+ B1: Nhấn vào nút ![Sửa đoàn viên](./img/SuaDoanVien.png).
+ B2: Nhập đầy đủ thông tin đoàn viên (Những trường thông tin đánh dẫu * là bắt buộc)
+ B3: Nhấn __Lưu thay đổi__ để hoàn thành.

**3. Xóa đoàn viên**
+ B1: Nhấn vào nút ![Xóa đoàn viên](./img/XoaDoanVien.png).
+ B2: Nhấn __Xóa__ để hoàn thành.

**4. Tìm kiếm đoàn viên**
+ B1: Nhấn vào thanh tìm kiếm __Thêm đoàn viên__.
+ B2: Tìm kiếm theo tên, số hiệu, đơn vị, lúc này hệ thống sẽ tự động trả kết quả tìm kiếm.

**5. Xuất danh sách**
+ Nhấn vào nút __Xuất danh sách__ và chờ file tự động tải về.


## Các tính năng quản lý thu chi đoàn phí (Nhấn vào mục "Thu chi đoàn phí" ở đầu màn hình)
**1. Nhập thông tin 1 khoản thu/ chi mới (chỉ áp dụng cho mục "Các khoản thu khác" và "Các khoản chi")**
+ B1: Nhấn nút __Thêm/ Thêm khoản chi__ 
+ B2: Với mục __"Các khoản thu khác"__:
  * Nhập __Nội dung hoạt động__ và __Số tiền__ và __Mô tả tính toán__ (Những trường đánh dấu * là bắt buộc).
**2. Sửa thông tin 1 khoản thu/ chi**
**3. Xóa thông tin thu chi (chỉ áp dụng cho mục "Các khoản thuc khác" và "Các khoản chi")**
**4. Danh sách tổng hợp các thu chi của các tháng**
**5. Xuất danh sách thu chi đoàn phí qua file Word**