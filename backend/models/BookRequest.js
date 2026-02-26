const mongoose = require('mongoose');

const bookRequestSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    department: { type: String, required: true }, // To easily filter requests by department for the HOD
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' }, // Optional if requesting a predefined book
    title: { type: String }, // For new book requests
    author: { type: String }, // For new book requests
    reason: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    requestedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('BookRequest', bookRequestSchema);
