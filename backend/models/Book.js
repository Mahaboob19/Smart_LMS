const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    department: { type: String, required: true },
    totalCopies: { type: Number, required: true, min: 1 },
    availableCopies: { type: Number, required: true, min: 0 },
    description: { type: String, required: true },
    qrCodes: [{ type: String }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Book', bookSchema);
