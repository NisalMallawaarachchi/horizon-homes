import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: "https://i.postimg.cc/Y0JPMM7V/image.png",
    },
  },
  { timestamps: true } // Automatically adds createdAt & updatedAt
);

const User = mongoose.model("User", userSchema);

export default User;
