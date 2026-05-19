const mongoose = require('mongoose')

const visitSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: [true, 'Property is required'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    date: {
      type: Date,
      required: [true, 'Visit date is required'],
    },
    time: {
      type: String,
      required: [true, 'Visit time is required'],
      trim: true,
      match: [/^([01]\d|2[0-3]):[0-5]\d$/, 'Time must use HH:mm format'],
    },
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'cancelled'],
      default: 'scheduled',
    },
  },
  {
    timestamps: true,
  },
)

visitSchema.index({ property: 1 })
visitSchema.index({ user: 1 })
visitSchema.index({ date: 1 })
visitSchema.index({ status: 1 })

module.exports = mongoose.model('Visit', visitSchema)
