// This code allows for the file to be compressed before being transcribed.
// Needed because Whisper couldn't handle large files.
import fs from "fs";
import ffmpeg from "fluent-ffmpeg";

async function query(filename) {
  return new Promise((resolve, reject) => {
    // Start the compression process
    ffmpeg(filename)
      .audioBitrate(128)
      .save("output.mp3")
      .on("end", async () => {
        console.log("Compression finished");

        try {
          // Read the compressed file after compression is finished
          const data = fs.readFileSync("output.mp3");

          // Make the API request with the compressed file
          const response = await fetch(
            "https://api-inference.huggingface.co/models/openai/whisper-large-v3",
            {
              headers: {
                Authorization: "Bearer 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", // Make sure your token is correct
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

// Call the query function
// /Users/hughculling/Downloads/demon.mp3
// /Users/hughculling/Downloads/h2os-whippin.wav
// /Users/hughculling/Downloads/lmxh1-drowesy.mp3
// /Users/hughculling/Downloads/lmxhugh-temptations.m4a

query("/Users/hughculling/Downloads/sexteen.m4a")
  .then((response) => {
    if (response) {
      console.log("API response:", response);
    } else {
      console.log("No valid response from API.");
    }
  })
  .catch((error) => {
    console.error("Error during processing:", error);
  });
