import { NextResponse } from "next/server";
import fs from "fs";
import ffmpeg from "fluent-ffmpeg";
import { promises } from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

async function query(filename) {
  return new Promise((resolve, reject) => {
    // Start the compression process
    ffmpeg(filename)
      .audioBitrate(128)
      .save("./src/app/output.mp3")
      .on("end", async () => {
        console.log("Compression finished");

        try {
          // Read the compressed file after compression is finished
          const data = fs.readFileSync("./src/app/output.mp3");

          // Make the API request with the compressed file
          const response = await fetch(
            "https://api-inference.huggingface.co/models/openai/whisper-large-v3",
            {
              headers: {
                Authorization: `Bearer ${process.env.HF_ACCESS_TOKEN}`, // Make sure your token is correct
                "Content-Type": "application/json",
              },
              method: "POST",
              body: data,
            }
          );

          // Log the response before parsing
          // console.log("Raw Response:", response);

          // Check if the request was successful
          if (!response.ok) {
            console.error(
              `HTTP Error: ${response.status} - ${response.statusText}`
            );
            resolve(null);
          }

          // Parse and log the response
          const result = await response.json();
          // console.log("Parsed JSON Response:", result);

          // Resolve the promise with the API result
          resolve(result);
        } catch (error) {
          // Reject the promise if an error occurs
          console.error("Error during API request:", error);
          reject(error);
        }
      })
      .on("error", (err) => {
        // Handle compression errors
        console.error("Compression error:", err);
        reject(err);
      });
  });
}

export const POST = async (request) => {
  try {
    const data = await request.formData();
    const file = data.get("audio");

    console.log(`file = ${file}`);

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Validate file type (optional but recommended)
    if (!file.type.startsWith("audio/")) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    // Read the file data
    const buffer = Buffer.from(await file.arrayBuffer());

    // Generate a unique filename
    const filename = `${uuidv4()}_${file.name}`;

    // Define the directory to save the file
    const uploadDir = path.join(process.cwd(), "public", "uploads");

    // Ensure the directory exists
    await promises.mkdir(uploadDir, { recursive: true });

    // Write the file to the upload directory
    const filePath = path.join(uploadDir, filename);

    console.log(`filepath = ${filePath}`);

    await promises.writeFile(filePath, buffer);

    const result = await query(filePath);

    console.log(result);

    return NextResponse.json({
      message: "File uploaded successfully",
      filename,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
