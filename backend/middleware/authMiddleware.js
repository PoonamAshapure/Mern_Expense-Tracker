// // import jwt from "jsonwebtoken";
// // import User from "../models/User.js";

// // export const protect = async (req, res, next) => {
// //   let token = req.headers.authorization?.split(" ")[1];
// //   if (!token)
// //     return res.status(401).json({ message: "Not authorized, no token" });

// //   try {
// //     const decoded = jwt.verify(token, process.env.JWT_SECRET);
// //   } catch (error) {
// //     res.status(401).json({ message: "Not authorized, token failed" });
// //   }
// // };

// import jwt from "jsonwebtoken";
// import User from "../models/User.js";

// export const protect = async (req, res, next) => {
//   let token;

//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith("Bearer")
//   ) {
//     try {
//       token = req.headers.authorization.split(" ")[1];

//       const decoded = jwt.verify(token, process.env.JWT_SECRET);

//       req.user = await User.findById(decoded.userId).select("-password"); // attach user to request

//       next(); // proceed to next middleware or route handler
//     } catch (error) {
//       console.error("Token verification failed:", error.message);
//       return res.status(401).json({ message: "Not authorized, token failed" });
//     }
//   } else {
//     return res.status(401).json({ message: "Not authorized, no token" });
//   }
// };

import jwt from "jsonwebtoken";
import User from "../models/User.js"; // Uncomment this if you want to fetch user info from DB

export const protect = async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Optionally fetch user from DB if needed
    // req.user = await User.findById(decoded.id).select("-password");

    req.user = decoded; // assuming decoded contains { id, role, etc. }

    next(); // pass control to the next middleware
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};
