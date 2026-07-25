const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    budgetRange: {
      type: String,
      required: true,
      enum: ['<5k', '5-10k', '10k+']
    },
    message: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      required: true,
      enum: ['New', 'Contacted', 'Closed'],
      default: 'New'
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

leadSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    return ret;
  }
});

module.exports = mongoose.model('Lead', leadSchema);
