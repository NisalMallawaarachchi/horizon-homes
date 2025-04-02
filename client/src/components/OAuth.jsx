import { FcGoogle } from "react-icons/fc";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

export default function OAuth() {
  // Redux dispatch function
  const dispatch = useDispatch();

  // React Router navigate function
  const navigate = useNavigate();

  // Handle Google Sign-In (Placeholder function)
  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);

      const res = await fetch("api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });
      const data = await res.json();
      console.log("Backend response:", data); // Verify structure
      dispatch(signInSuccess(data.user)); // Send only the user object
      navigate("/"); // Redirect to home page after sign-in
    } catch (error) {
      console.log("Could not sign in with google.", error);
    }
  };

  return (
    <div>
      {/* Continue with Google */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        className="w-full flex items-center justify-center border border-gray-300 py-2 rounded-lg text-gray-700 font-semibold hover:bg-gray-100 transition duration-300"
      >
        <FcGoogle className="text-2xl mr-3" />
        Continue with Google
      </button>
    </div>
  );
}
