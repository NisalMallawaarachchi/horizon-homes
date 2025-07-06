import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";

export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  let listing;

  try {
    listing = await Listing.findById(req.params.id);
  } catch (error) {
    return next(errorHandler("Invalid listing ID", 400));
  }

  if (!listing) {
    return next(errorHandler("Listing not found", 404));
  }

  if (req.user._id !== listing.userRef.toString()) {
    return next(
      errorHandler("You are not authorized to delete this listing", 403)
    );
  }

  try {
    await Listing.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Listing deleted successfully" });
  } catch (error) {
    return next(error);
  }
};
