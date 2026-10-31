const express = require("express");
const router = express.Router();
const Device = require("../models/Device");

// GET: Danh sách và tìm kiếm thiết bị
router.get("/", async (req, res) => {
    try {
        const { search } = req.query;
        let filter = {};

        if (search) {
            const keyword = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            const regex = new RegExp(keyword, "i");

            filter = {
                $or: [
                    { deviceId: regex },
                    { name: regex },
                    { deviceType: regex },
                    { room: regex }
                ]
            };
        }

        const devices = await Device.find(filter).sort({ createdAt: -1 });

        res.json(devices);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET: Chi tiết thiết bị
router.get("/:id", async (req, res) => {
    try {
        const device = await Device.findById(req.params.id);

        if (!device) {
            return res.status(404).json({
                message: "Không tìm thấy thiết bị"
            });
        }

        res.json(device);
    } catch (error) {
        res.status(400).json({ message: "ID thiết bị không hợp lệ" });
    }
});

// POST: Thêm thiết bị
router.post("/", async (req, res) => {
    try {
        const device = new Device(req.body);
        const savedDevice = await device.save();

        res.status(201).json({
            message: "Thêm thiết bị thành công",
            data: savedDevice
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: "Mã thiết bị đã tồn tại"
            });
        }

        res.status(400).json({
            message: error.message
        });
    }
});

// PUT: Cập nhật thiết bị
router.put("/:id", async (req, res) => {
    try {
        const device = await Device.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!device) {
            return res.status(404).json({
                message: "Không tìm thấy thiết bị"
            });
        }

        res.json({
            message: "Cập nhật thiết bị thành công",
            data: device
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: "Mã thiết bị đã tồn tại"
            });
        }

        res.status(400).json({ message: error.message });
    }
});

// DELETE: Xóa thiết bị
router.delete("/:id", async (req, res) => {
    try {
        const device = await Device.findByIdAndDelete(req.params.id);

        if (!device) {
            return res.status(404).json({
                message: "Không tìm thấy thiết bị"
            });
        }

        res.json({
            message: "Xóa thiết bị thành công"
        });
    } catch (error) {
        res.status(400).json({ message: "ID thiết bị không hợp lệ" });
    }
});

module.exports = router;
