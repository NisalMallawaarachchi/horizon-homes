import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import Listing from "../models/listing.model.js";

export const test = (req, res) => {
  res.send("Welcome to the server!");
};

export const updateUser = async (req, res, next) => {
  // Ensure only the user can update their own account
  if (req.user._id !== req.params.id) {
    return next(errorHandler("You can only update your own account", 403));
  }

  try {
    // Hash the password if it's being updated
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    // Perform the update
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password, // only if it's been hashed above
          avatar: req.body.avatar,
        },
      },
      { new: true } // return the updated document
    );

    // Send updated user back
    const { password, ...rest } = updatedUser._doc; // exclude password
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  // Ensure only the user can delete their own account
  if (req.user._id !== req.params.id) {
    return next(errorHandler("You can only delete your own account", 403));
  }

  try {
    await User.findByIdAndDelete(req.params.id);
    res
      .clearCookie("access_token")
      .status(200)
      .json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const getUserListings = async (req, res, next) => {
  try {
    // Allow access only if the logged-in user's ID matches the requested ID
    if (req.user.id == req.params.id) {
      return next(errorHandler("You can only view your own listings!", 403));
    }

    // Fetch listings belonging to the user
    const listings = await Listing.find({ userRef: req.params.id });

    // Return the listings
    res.status(200).json(listings);
  } catch (error) {
    next(errorHandler("Failed to fetch listings", 500));
  }
};

