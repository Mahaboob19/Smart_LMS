const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    qrCode: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    issuedDate: { type: Date, default: Date.now },
    dueDate: { type: Date, required: true },
    returnDate: { type: Date },
    status: { type: String, enum: ['Issued', 'Returned'], default: 'Issued' },
    fine: { type: Number, default: 0 }
});

module.exports = mongoose.model('Transaction', transactionSchema);
