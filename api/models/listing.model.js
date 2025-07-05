import mongoose from "mongoose";

const listingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  regularPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  discountedPrice: {
    type: Number,
    min: 0,
  },
  bathrooms: {
    type: Number,
    required: true,
  },
  bedrooms: {
    type: Number,
    required: true,
  },
  furnished: {
    type: Boolean,
    required: true,
  },
  parking: {
    type: Boolean,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  offer: {
    type: Boolean,
    default: true,
  },
  imageUrls: {
    type: Array,
    required: true,
  },
  userRef: {
    type: String,
    required: true,
  },
}, {
  timestamps: true // Automatically manage createdAt and updatedAt fields
});

const Listing = mongoose.model("Listing", listingSchema);

export default Listing;
