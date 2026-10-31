
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());

// API kiểm tra trạng thái máy chủ
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        message: "Device Management API is running"
    });
});

// API quản lý thiết bị
app.use("/api/devices", require("./routes/devices"));

const PORT = process.env.PORT || 5000;

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Server error:", error);
    });
