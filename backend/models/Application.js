const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  company: { type: String, required: true },
  role: { type: String, required: true },
  status: {
    type: String,
    enum: ['Applied', 'Interview', 'Offer', 'Rejected'],
    default: 'Applied'
  },
  jobUrl: { type: String },
  notes: { type: String },
  appliedDate: { type: Date, default: Date.now },

  // Interview details
  interview: {
    type: { type: String, enum: ['Remote', 'On-site', 'Hybrid'] },
    date: { type: Date },
    round: { type: String, enum: ['First Round', 'Second Round', 'Final Round'] },
    interviewer: { type: String },
    notes: { type: String }
  }

}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);