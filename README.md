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
+ B1: Nhấn vào thanh ![Tìm kiếm đoàn viên](./img/TimKiemDoanVien.png).
+ B2: Tìm kiếm theo tên, số hiệu, đơn vị, lúc này hệ thống sẽ tự động trả kết quả tìm kiếm.

**5. Xuất danh sách**
+ Nhấn vào nút __Xuất danh sách__ và chờ file tự động tải về.


## Các tính năng quản lý thu chi đoàn phí (Nhấn vào mục "Thu chi đoàn phí" ở đầu màn hình)
**1. Nhập thông tin 1 khoản thu/ chi mới (chỉ áp dụng cho mục "Các khoản thu khác" và "Các khoản chi")**
+ Với mục __"Các khoản thu khác"__: Nhấn nút __Thêm__, sau đó nhập __Nội dung hoạt động__, __Số tiền__ và __Mô tả tính toán__ (Những trường đánh dấu * là bắt buộc).
+ Với mục __"Các khoản chi"__: Nhấn nút __Thêm/ Thêm khoản chi__, sau đó nhập __Nội dung chi__, __Số tiền__, __Người chi__ và __Người duyệt__

**2. Sửa thông tin 1 khoản thu/ chi**
+ Với mục __"Các khoản thu khác"__: Nhấn nút __Thêm__, sau đó nhập __Nội dung hoạt động__, __Số tiền__ và __Mô tả tính toán__ (Những trường đánh dấu * là bắt buộc).
+ Với mục __"Các khoản chi"__: Nhấn nút __Thêm/ Thêm khoản chi__, sau đó nhập __Nội dung chi__, __Số tiền__, __Người chi__ và __Người duyệt__

**3. Xóa thông tin thu chi (chỉ áp dụng cho mục "Các khoản thu khác" và "Các khoản chi")**
+ Nhấn nút ![Xóa thông tin thu chi](./img/XoaDoanVien.png) để xóa

**4. Nhập thu đoàn phí**
+ Chỉ cần nhập __Số thành viên__ và __Số tiền/người__, hệ thống sự tự động tỉnh tổng thu đoàn phí theo cấp bậc và tổng chung.

**5. Xuất danh sách thu chi đoàn phí qua file Word**
+ Nhấn vào nút __Xuất file Word__ và chờ file tự động tải về.