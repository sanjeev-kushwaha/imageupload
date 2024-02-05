"use client";

import React, { useState, ChangeEvent } from "react";
import { api_interceptor } from "@/interceptor/api_interceptor";

export const ChunkedImageUploader: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    }
  };

  const uploadChunks = async () => {
    if (!imageFile) return;

    const chunkSize = 250 * 1024; // 1MB chunk size
    const fileSize = imageFile.size;
    const chunks = Math.ceil(fileSize / chunkSize);
    let uploadedChunks = 0;

    const formData = new FormData();

    for (let i = 0; i < chunks; i++) {
      const start = i * chunkSize;
      const end = Math.min(fileSize, start + chunkSize);
      const chunk = imageFile.slice(start, end);
      formData.append("chunk", chunk);
      formData.append("currentChunk", String(i + 1));
      formData.append("totalChunks", String(chunks));

      uploadedChunks++;

      const progressPercentage = Math.round((uploadedChunks / chunks) * 100);
      setUploadProgress(progressPercentage);
    }

    try {
      const response = await api_interceptor.post("/fileupload", formData);
      console.log("Upload successful!", response);
    } catch (error) {
      console.error("Error uploading chunks:", error);
    }

    setImageFile(null);
    setUploadProgress(0);
    // Optionally, you can reset the input field as well
    const fileInput = document.getElementById("fileInput") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  return (
    <div>
      <input
        type="file"
        id="fileInput"
        onChange={handleFileChange}
        className="border"
      />
      <button
        onClick={uploadChunks}
        className="bg-green-500 hover:bg-green-800 transition-all duration-300 ml-2 px-4 py-2 rounded-md"
      >
        Upload
      </button>
      {uploadProgress > 0 && <div>Upload Progress: {uploadProgress}%</div>}
    </div>
  );
};
