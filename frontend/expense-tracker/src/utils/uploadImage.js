// import { API_PATHS } from "./apiPaths";
// import axiosInstance from "./axiosInstance";

// const uploadImage = async (imageFile) => {
//   const formData = new FormData();
//   // Append image file to form data
//   formData.append("image", imageFile);

//   try {
//     const response = await axiosInstance.post(
//       API_PATHS.IMAGE.UPLOAD_IMAGE,
//       formData,
//       {
//         headers: {
//           "Content-Type": "multipart/form-data", // Set header for file upload
//         },
//       }
//     );
//     return response.data; //Return response data
//   } catch (error) {
//     console.error("Error uploading the image:", error);
//     throw error; // Rethrow error for handling
//   }
// };

// export default uploadImage;

import { API_PATHS } from "./apiPaths";
import axiosInstance from "./axiosInstance";

const uploadImage = async (imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile); // 👈 Correct field name for multer

  try {
    const response = await axiosInstance.post(
      API_PATHS.IMAGE.UPLOAD_IMAGE, // 👈 Points to your deployed backend
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data.imageUrl; // 👈 Returns just the image URL
  } catch (error) {
    console.error(
      "❌ Error uploading the image:",
      error?.response?.data || error.message
    );
    throw new Error(error?.response?.data?.message || "Image upload failed");
  }
};

export default uploadImage;
