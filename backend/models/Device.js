const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema({
    deviceId: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    deviceType: {
        type: String,
        required: true,
        trim: true
    },
    room: {
        type: String,
        required: true,
        trim: true
    },
    brand: {
        type: String,
        default: ""
    },
    model: {
        type: String,
        default: ""
    },
    quantity: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        required: true,
        enum: [
            "Đang sử dụng",
            "Hư hỏng",
            "Đang sửa chữa",
            "Ngừng sử dụng"
        ]
    },
    purchaseDate: {
        type: Date,
        default: null
    },
    description: {
        type: String,
        default: ""
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Device", deviceSchema);
