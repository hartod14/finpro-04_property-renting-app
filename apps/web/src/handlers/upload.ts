import { api } from "./_api";

export const uploadImage = async (formData: FormData) => {
    try { // Retrieve the access token
  
      return await api(
        "/upload-image",
        "POST",
        {
          body: formData,
        }
      );
  
    } catch (error) {
      console.error("Upload failed:", error);
      throw error;
    }
  };