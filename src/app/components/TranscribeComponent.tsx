"use client";

import { useState } from "react";

export default function TranscribeComponent() {
  // Explicitly define the state type as 'File | null'
  const [audioFile, setAudioFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAudioFile(e.target.files[0]);
    }
  };

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!audioFile) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("audio", audioFile);

    try {
      const res = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (res.ok) {
        alert("File uploaded successfully!");
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="audio/*" onChange={handleFileChange} />
        <button type="submit">Upload Audio</button>
      </form>
    </>
  );
}
