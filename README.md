 ## HỆ THỐNG QUẢN LÝ THIẾT BỊ PHÒNG HỌC
1. Thông tin sinh viên
- Họ tên: Đỗ Nhật Anh
- MSSV: 235359
- Học phần: Điện toán đám mây

## 2. Giới thiệu đề tài
Xây dựng hệ thống quản lý thiết bị phòng học trên nền tảng điện toán đám mây.

## 3. Công nghệ sử dụng
- React
- Node.js
- Express
- MongoDB Atlas
- GitHub
- Docker
- Docker Hub
- Render

## 4. Cấu trúc dự án
- backend/: Xử lý API và kết nối cơ sở dữ liệu.
- frontend/: Giao diện quản lý thiết bị.

## 5. Chức năng
- Xem danh sách thiết bị.
- Thêm thiết bị.
- Cập nhật thiết bị.
- Xóa thiết bị.
- Tìm kiếm thiết bị.
- Quản lý tình trạng thiết bị.

## 6. Triển khai
Thông tin triển khai sẽ được cập nhật sau. 
## 7. Cơ sở dữ liệu MongoDB Atlas

- Database: 235359_DoNhatAnh
- Collection: devices

### Dữ liệu thiết bị mẫu
- TB001: Máy chiếu Epson.
- TB002: Máy tính Dell.
- TB003: Loa Sony.

Cơ sở dữ liệu được lưu trữ trên MongoDB Atlas.
Backend sẽ sử dụng chuỗi kết nối MongoDB Atlas
thông qua biến môi trường MONGODB_URI.
cd /workspaces/235359_DoNhatAnh && cat >> README.md <<'EOF'

## Chạy backend bằng Docker

### Build image
```bash
cd backend
docker build -t dnanh1405/mern-backend:1.0 .
```

### Chạy container
Tạo file `backend.env` (không commit lên Git) với nội dung:
PORT=5000
MONGODB_URI=mongodb+srv://clouduser:Nhatanh12345@cloud-lab.f9ib0az.mongodb.net/cloud_lab?retryWrites=true&w=majority&appName=cloud-lab

Sau đó chạy:
```bash
docker run -d --name backend -p 5000:5000 --env-file backend.env dnanh1405/mern-backend:1.0
docker logs backend
```

### Lấy image từ Docker Hub
```bash
docker pull dnanh1405/mern-backend:1.0
```

> Image không chứa thông tin bí mật. Các biến môi trường (`MONGODB_URI`, `PORT`) được truyền khi chạy container. Xem `backend/.env.example` để biết các biến cần thiết.
EOF