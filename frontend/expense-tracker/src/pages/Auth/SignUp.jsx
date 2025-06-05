import React, { useContext, useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Inputs/Input";
import { Link } from "react-router-dom";

import ProfilePhotoSelector from "../../components/Inputs/ProfilePhotoSelector";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/userContext";
import uploadImage from "../../utils/uploadImage";

const SignUp = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState(null);
  const { updateUser } = useContext(UserContext);

  const navigate = useNavigate();

  // Handle Sign Up Form Submit
  const handleSignUp = async (e) => {
    e.preventDefault();

    let profileImageUrl = "";

    if (!fullName) {
      setError("Please eneter your name");
      return;
    }

    if (!password) {
      setError("Please eneter the password");
      return;
    }
    setError("");

    // SignUp API Call

    try {
      // Upload image if present
      if (profilePic) {
        const imageUploadsRes = await uploadImage(profilePic);
        profileImageUrl = imageUploadsRes.imageUrl || "";
      }
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        fullName,
        email,
        password,
        profileImageUrl,
      });
      const { token, user } = response.data;
      if (token) {
        localStorage.setItem("token", token);
        updateUser(user);
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  //   return (
  //     <AuthLayout>
  //       <div className="lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center">
  //         <h3 className="text-xl font-semibold text-black">Create an Account</h3>
  //         <p className="text-xs text-slate-700 mt-[5px] mb-6">
  //           Join us today by entering your details below
  //         </p>

  //         <form onSubmit={handleSignUp}>
  //           <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />

  //           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  //             <Input
  //               value={fullName}
  //               onChange={({ target }) => setFullName(target.value)}
  //               label="Full Name"
  //               placeholder="John"
  //               type="text"
  //             />

  //             <Input
  //               value={email}
  //               onChange={({ target }) => setEmail(target.value)}
  //               label="Email Address"
  //               placeholder="john@example.com"
  //               type="text"
  //             />

  //             <div className="col-span-2">
  //               <Input
  //                 value={password}
  //                 onChange={({ target }) => setPassword(target.value)}
  //                 label="Password"
  //                 placeholder="Min 8 Characters"
  //                 type="password"
  //               />
  //             </div>
  //           </div>

  //           {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}
  //           <button className="btn-primary" type="submit">
  //             SIGNUP
  //           </button>

  //           <p className="text-[13px] text-slate-800 mt-3">
  //             Already have an account?{""}
  //             <Link className="font-medium text-primary underline" to="/login">
  //               Login
  //             </Link>
  //           </p>
  //         </form>
  //       </div>
  //     </AuthLayout>
  //   );
  // };

  return (
    <AuthLayout>
      <div className="w-full max-w-md mx-auto px-4 py-8 flex flex-col justify-center min-h-screen">
        <h3 className="text-2xl font-semibold text-black mb-2 text-center">
          Create an Account
        </h3>
        <p className="text-xs text-slate-700 mb-6 text-center">
          Join us today by entering your details below
        </p>

        <form onSubmit={handleSignUp} className="space-y-6">
          <div className="flex justify-center mb-6">
            <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />
          </div>

          <div className="grid grid-cols-1 gap-4">
            <Input
              value={fullName}
              onChange={({ target }) => setFullName(target.value)}
              label="Full Name"
              placeholder="John"
              type="text"
            />

            <Input
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              label="Email Address"
              placeholder="john@example.com"
              type="email"
            />

            <Input
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              label="Password"
              placeholder="Min 8 Characters"
              type="password"
            />
          </div>

          {error && (
            <p className="text-red-500 text-xs pb-2.5 text-center">{error}</p>
          )}

          <button className="btn-primary w-full py-3 text-center" type="submit">
            SIGNUP
          </button>

          <p className="text-[13px] text-slate-800 mt-3 text-center">
            Already have an account?{" "}
            <Link className="font-medium text-primary underline" to="/login">
              Login
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
