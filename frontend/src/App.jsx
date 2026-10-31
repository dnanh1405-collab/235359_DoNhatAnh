
import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const emptyDevice = {
    deviceId: "",
    name: "",
    deviceType: "",
    room: "",
    brand: "",
    model: "",
    quantity: 1,
    status: "Đang sử dụng",
    purchaseDate: "",
    description: ""
};

function App() {
    const [devices, setDevices] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [selected, setSelected] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(emptyDevice);

    const loadDevices = async (keyword = search) => {
        setLoading(true);
        setError("");

        try {
            const response = await axios.get(`${API_URL}/api/devices`, {
                params: { search: keyword }
            });
            setDevices(response.data);
        } catch (err) {
            setError(err.response?.data?.message || "Không thể tải danh sách thiết bị. Hãy kiểm tra backend.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDevices("");
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            loadDevices(search);
        }, 400);

        return () => clearTimeout(timer);
    }, [search]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        const payload = {
            ...form,
            quantity: Number(form.quantity),
            purchaseDate: form.purchaseDate || null
        };

        try {
            if (editingId) {
                await axios.put(`${API_URL}/api/devices/${editingId}`, payload);
                setMessage("Cập nhật thiết bị thành công!");
            } else {
                await axios.post(`${API_URL}/api/devices`, payload);
                setMessage("Thêm thiết bị thành công!");
            }

            setForm(emptyDevice);
            setEditingId(null);
            await loadDevices();
        } catch (err) {
            setError(err.response?.data?.message || "Thao tác thất bại.");
        }
    };

    const handleEdit = (device) => {
        setForm({
            ...emptyDevice,
            ...device,
            purchaseDate: device.purchaseDate
                ? device.purchaseDate.substring(0, 10)
                : ""
        });
        setEditingId(device._id);
        setSelected(null);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa thiết bị này?")) return;

        setError("");
        setMessage("");

        try {
            await axios.delete(`${API_URL}/api/devices/${id}`);
            setMessage("Xóa thiết bị thành công!");
            if (selected?._id === id) setSelected(null);
            await loadDevices();
        } catch (err) {
            setError(err.response?.data?.message || "Không thể xóa thiết bị.");
        }
    };

    const cancelEdit = () => {
        setForm(emptyDevice);
        setEditingId(null);
    };

    const statusClass = (status) => {
        if (status === "Đang sử dụng") return "active";
        if (status === "Hư hỏng") return "broken";
        if (status === "Đang sửa chữa") return "repair";
        return "stopped";
    };

    return (
        <div className="container">
            <header className="header">
                <div>
                    <h1>QUẢN LÝ THIẾT BỊ PHÒNG HỌC</h1>
                    <p>Hệ thống theo dõi và quản lý trang thiết bị</p>
                </div>
            </header>

            <section className="stats">
                <div className="stat-card">
                    <span>Tổng số thiết bị</span>
                    <strong>{devices.length}</strong>
                </div>
                <div className="stat-card">
                    <span>Đang sử dụng</span>
                    <strong>{devices.filter(d => d.status === "Đang sử dụng").length}</strong>
                </div>
                <div className="stat-card">
                    <span>Hư hỏng</span>
                    <strong>{devices.filter(d => d.status === "Hư hỏng").length}</strong>
                </div>
                <div className="stat-card">
                    <span>Đang sửa chữa</span>
                    <strong>{devices.filter(d => d.status === "Đang sửa chữa").length}</strong>
                </div>
            </section>

            {message && <div className="alert success">{message}</div>}
            {error && <div className="alert danger">{error}</div>}

            <section className="panel">
                <h2>{editingId ? "Cập nhật thiết bị" : "Thêm thiết bị mới"}</h2>

                <form onSubmit={handleSubmit} className="device-form">
                    <input name="deviceId" placeholder="Mã thiết bị" value={form.deviceId} onChange={handleChange} required />
                    <input name="name" placeholder="Tên thiết bị" value={form.name} onChange={handleChange} required />
                    <input name="deviceType" placeholder="Loại thiết bị" value={form.deviceType} onChange={handleChange} required />
                    <input name="room" placeholder="Phòng học" value={form.room} onChange={handleChange} required />
                    <input name="brand" placeholder="Thương hiệu" value={form.brand} onChange={handleChange} />
                    <input name="model" placeholder="Model" value={form.model} onChange={handleChange} />
                    <input name="quantity" type="number" min="0" placeholder="Số lượng" value={form.quantity} onChange={handleChange} required />
                    <select name="status" value={form.status} onChange={handleChange}>
                        <option>Đang sử dụng</option>
                        <option>Hư hỏng</option>
                        <option>Đang sửa chữa</option>
                        <option>Ngừng sử dụng</option>
                    </select>
                    <label className="date-field">
                        Ngày mua
                        <input name="purchaseDate" type="date" value={form.purchaseDate} onChange={handleChange} />
                    </label>
                    <textarea name="description" placeholder="Mô tả thiết bị" value={form.description} onChange={handleChange} />
                    <div className="form-actions">
                        <button type="submit">{editingId ? "Lưu cập nhật" : "Thêm thiết bị"}</button>
                        {editingId && <button type="button" className="secondary" onClick={cancelEdit}>Hủy</button>}
                    </div>
                </form>
            </section>

            <section className="panel">
                <div className="list-heading">
                    <h2>Danh sách thiết bị</h2>
                    <input
                        className="search"
                        placeholder="Tìm theo mã, tên, loại hoặc phòng..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>

                {loading ? (
                    <p className="loading">Đang tải dữ liệu...</p>
                ) : (
                    <div className="table-wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th>Mã thiết bị</th>
                                    <th>Tên thiết bị</th>
                                    <th>Loại</th>
                                    <th>Phòng</th>
                                    <th>Số lượng</th>
                                    <th>Tình trạng</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {devices.map(device => (
                                    <tr key={device._id}>
                                        <td>{device.deviceId}</td>
                                        <td>{device.name}</td>
                                        <td>{device.deviceType}</td>
                                        <td>{device.room}</td>
                                        <td>{device.quantity}</td>
                                        <td>
                                            <span className={`status ${statusClass(device.status)}`}>
                                                {device.status}
                                            </span>
                                        </td>
                                        <td className="actions">
                                            <button className="small" onClick={() => setSelected(device)}>Xem</button>
                                            <button className="small edit" onClick={() => handleEdit(device)}>Sửa</button>
                                            <button className="small delete" onClick={() => handleDelete(device._id)}>Xóa</button>
                                        </td>
                                    </tr>
                                ))}
                                {devices.length === 0 && (
                                    <tr><td colSpan="7" className="empty">Không tìm thấy thiết bị nào.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            {selected && (
                <div className="modal-backdrop" onClick={() => setSelected(null)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <h2>Chi tiết thiết bị</h2>
                        <p><b>Mã thiết bị:</b> {selected.deviceId}</p>
                        <p><b>Tên:</b> {selected.name}</p>
                        <p><b>Loại:</b> {selected.deviceType}</p>
                        <p><b>Phòng:</b> {selected.room}</p>
                        <p><b>Số lượng:</b> {selected.quantity}</p>
                        <p><b>Tình trạng:</b> {selected.status}</p>
                        <p><b>Thương hiệu:</b> {selected.brand || "Chưa có"}</p>
                        <p><b>Model:</b> {selected.model || "Chưa có"}</p>
                        <p><b>Ngày mua:</b> {selected.purchaseDate ? new Date(selected.purchaseDate).toLocaleDateString("vi-VN") : "Chưa có"}</p>
                        <p><b>Mô tả:</b> {selected.description || "Không có"}</p>
                        <button onClick={() => setSelected(null)}>Đóng</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
