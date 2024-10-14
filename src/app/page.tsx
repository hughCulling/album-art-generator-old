// // "use client";
// // import { useState } from "react";

// export default function Page() {
//   // const [lyrics, setLyrics] = useState("");
//   // const [response, setResponse] = useState("");

//   // // Function to handle form submission
//   // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//   //   e.preventDefault();

//   //   // Send the lyrics to the API route
//   //   const res = await fetch("/api/gemini", {
//   //     method: "POST",
//   //     headers: {
//   //       "Content-Type": "application/json",
//   //     },
//   //     body: JSON.stringify({ lyrics }),
//   //   });

//   //   const data = await res.json();
//   //   setResponse(data.response); // Update the state with the API response
//   // };

//   return (
//     <div>
//       {/* <h2>Submit your lyrics</h2>
//       <form onSubmit={handleSubmit}>
//         <textarea
//           value={lyrics}
//           onChange={(e) => setLyrics(e.target.value)}
//           placeholder="Enter your lyrics here"
//           rows={10}
//           cols={50}
//         />
//         <br />
//         <button type="submit">Submit</button>
//       </form>

//       {response && (
//         <div>
//           <h2>Response from Gemini:</h2>
//           <p>{response}</p>
//         </div>
//       )} */}
//     </div>
//   );
// }

// "use client";
// import { useState } from "react";

import TranscribeComponent from "./components/TranscribeComponent";

export default function Page() {
  return (
    <>
      <TranscribeComponent />
    </>
  );
}
