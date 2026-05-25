const mongoose = require('mongoose')

const allowedDocumentTypes = ['ownership', 'taxReceipt', 'idProof', 'utilityBill', 'other']
const verificationStatuses = ['notSubmitted', 'submitted', 'underReview', 'verified', 'rejected']
const documentStatuses = ['submitted', 'approved', 'rejected']

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Property title is required'],
      trim: true,
      minlength: [5, 'Title must be at least 5 characters'],
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    description: {
      type: String,
      required: [true, 'Property description is required'],
      trim: true,
      minlength: [20, 'Description must be at least 20 characters'],
      maxlength: [3000, 'Description cannot exceed 3000 characters'],
    },
    type: {
      type: String,
      required: [true, 'Property type is required'],
      enum: ['House', 'Apartment', 'Villa', 'Plot', 'PG'],
    },
    price: {
      type: Number,
      required: [true, 'Property price is required'],
      min: [0, 'Price cannot be negative'],
    },
    location: {
      address: {
        type: String,
        required: [true, 'Address is required'],
        trim: true,
      },
      city: {
        type: String,
        required: [true, 'City is required'],
        trim: true,
      },
      lat: {
        type: Number,
        min: [-90, 'Latitude must be at least -90'],
        max: [90, 'Latitude cannot exceed 90'],
      },
      lng: {
        type: Number,
        min: [-180, 'Longitude must be at least -180'],
        max: [180, 'Longitude cannot exceed 180'],
      },
    },
    images: [
      {
        type: String,
        trim: true,
      },
    ],
    amenities: [
      {
        type: String,
        trim: true,
      },
    ],
    bhk: {
      type: Number,
      min: [0, 'BHK cannot be negative'],
    },
    bathrooms: {
      type: Number,
      min: [0, 'Bathrooms cannot be negative'],
    },
    area: {
      type: Number,
      required: [true, 'Area is required'],
      min: [0, 'Area cannot be negative'],
    },
    floor: {
      type: Number,
    },
    furnishing: {
      type: String,
      trim: true,
    },
    facing: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'sold', 'rejected'],
      default: 'pending',
    },
    rejectionReason: {
      type: String,
      trim: true,
      default: '',
      maxlength: [500, 'Rejection reason cannot exceed 500 characters'],
    },
    badge: {
      type: String,
      enum: ['New', 'Hot Deal', 'Price Reduced'],
    },
    agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Agent is required'],
    },
    views: {
      type: Number,
      default: 0,
      min: [0, 'Views cannot be negative'],
    },
    verification: {
      documents: [
        {
          type: {
            type: String,
            enum: allowedDocumentTypes,
            required: true,
          },
          url: {
            type: String,
            required: true,
            trim: true,
          },
          publicId: {
            type: String,
            required: true,
            trim: true,
          },
          uploadedAt: {
            type: Date,
            default: Date.now,
          },
          status: {
            type: String,
            enum: documentStatuses,
            default: 'submitted',
          },
        },
      ],
      status: {
        type: String,
        enum: verificationStatuses,
        default: 'notSubmitted',
      },
      verifiedAt: {
        type: Date,
      },
      verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      rejectionReason: {
        type: String,
        trim: true,
        default: '',
        maxlength: [500, 'Verification rejection reason cannot exceed 500 characters'],
      },
    },
  },
  {
    timestamps: true,
  },
)

propertySchema.index({ 'location.city': 1 })
propertySchema.index({ type: 1 })
propertySchema.index({ price: 1 })
propertySchema.index({ status: 1 })
propertySchema.index({ agent: 1 })
propertySchema.index({ 'verification.status': 1 })
propertySchema.index({ 'location.city': 1, type: 1, price: 1, status: 1 })

module.exports = mongoose.model('Property', propertySchema)
