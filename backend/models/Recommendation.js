const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema({
    department: { type: String, required: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    description: { type: String },
    recommendedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Recommendation', recommendationSchema);
