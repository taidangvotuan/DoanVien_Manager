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
+ B4: Mở thư mục backend, sau đó thực hiện lệnh sau: 
```
npm install
``` 
+ B4: Mở thư mục frontend, sau đó thực hiện lệnh sau: 
```
npm install
``` 
+ B5: Về lại thư mục DoanVien_Manager, sau đó thực hiện các lệnh sau để chạy phần mềm: 
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
**1. Nhập thông tin 1 khoản thu/ chi mới**
+ B1: Nhấn nút __Thêm__
+ B2: Sau đó nhập đầy đủ các thông tin (Những trường đánh dấu * là bắt buộc).
+ B3: Nhấn __Lưu__ để hoàn thành việc nhập.

**2. Sửa thông tin 1 khoản thu/ chi**
+ B1: Nhấn nút ![Sửa thông tin thu chi](./img/SuaDoanVien.png)
+ B2: Sau đó sửa các thông tin cho phù hợp (Những trường đánh dấu * là bắt buộc).

**3. Xóa thông tin thu chi**
+ Nhấn nút ![Xóa thông tin thu chi](./img/XoaDoanVien.png) để xóa

**4. Nhập thu đoàn phí**
+ Chỉ cần nhập __Số thành viên__ và __Số tiền/người__, hệ thống sự tự động tỉnh tổng thu đoàn phí theo cấp bậc và tổng chung.

**5. Lưu bảng thu chi**
+ Nhấn vào nút __Lưu bản ghi__ để lưu bảng thu chi.

**6. Xuất danh sách thu chi đoàn phí qua file Word**
+ Nhấn vào nút __Xuất file Word__ và chờ file tự động tải về.

**7. Khóa chỉnh sửa**
+ Nhấn vào nút __Khóa chỉnh sửa__, lúc này, khi đã nhấn thì không thể thực hiện các thao tác thêm, sửa, xóa khoản chi được nữa.
+ Để mở khóa, nhấn nút __Mở khóa__, lúc này có thể thực hiện các thao tác thêm, sửa, xóa bình thường.

**8. Danh sách tổng hợp**
+ Nhấn vào nút __Danh sách tổng hợp__, lúc này hệ thống sé hiện ra danh sách tiền còn lại của các tháng trước.

**9. Cập nhật trạng thái trong Danh sách tổng hợp**
+ B1: Nhấn vào nút __Danh sách tổng hợp__
+ B2: Nhấn vào nút __Khóa chỉnh sửa__ (Nếu muốn khóa) hoặc __Mở khóa__ (Nếu muốn bỏ khóa)
+ B3: Nhấn __Lưu bản ghi__