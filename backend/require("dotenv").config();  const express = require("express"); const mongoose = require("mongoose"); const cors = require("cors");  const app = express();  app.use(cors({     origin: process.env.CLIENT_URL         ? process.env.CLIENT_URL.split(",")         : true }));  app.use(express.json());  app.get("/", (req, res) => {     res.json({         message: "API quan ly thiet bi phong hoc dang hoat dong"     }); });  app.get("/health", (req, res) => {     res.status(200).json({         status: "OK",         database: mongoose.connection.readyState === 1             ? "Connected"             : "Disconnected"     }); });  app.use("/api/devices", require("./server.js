require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL
        ? process.env.CLIENT_URL.split(",")
        : true
}));

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "API quan ly thiet bi phong hoc dang hoat dong"
    });
});

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        database: mongoose.connection.readyState === 1
            ? "Connected"
            : "Disconnected"
    });
});

app.use("/api/devices", require("./routes/devices"));

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB connected successfully");

        app.listen(PORT, "0.0.0.0", () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error.message);
        process.exit(1);
    });
