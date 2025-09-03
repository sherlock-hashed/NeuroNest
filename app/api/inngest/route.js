// // app/api/inngest/route.js
// import { serve } from "inngest/next";
// import { inngest } from "../../../inngest/client";
// import { CreateNewUser, GenerateCourse, helloWorld } from "@/inngest/functions";

// function safeParseJson(body) {
//   try {
//     return JSON.parse(body);
//   } catch {
//     return null;
//   }
// }

// // Override serve to handle empty body gracefully (especially for PUT)
// export const { GET, POST, PUT } = serve({
//   client: inngest,
//   functions: [
//     helloWorld,
//     CreateNewUser,
//     GenerateCourse,
//   ],

//   // Optional override of handler to protect JSON.parse
//   async onRequest({ req, res }) {
//     try {
//       if (req.method === "PUT") {
//         // Buffer raw body instead of parsing automatically
//         const rawBody = await new Promise((resolve, reject) => {
//           let data = "";
//           req.on("data", chunk => { data += chunk; });
//           req.on("end", () => resolve(data));
//           req.on("error", (err) => reject(err));
//         });

//         if (rawBody.trim() === "") {
//           // Prevent JSON.parse error on empty body
//           req.body = {};
//         } else {
//           req.body = safeParseJson(rawBody) || {};
//         }
//       }
//     } catch (error) {
//       console.error("Error parsing body in inngest route:", error);
//       req.body = {};
//     }

//     // Proceed normally
//     return serve({
//       client: inngest,
//       functions: [
//         helloWorld,
//         CreateNewUser,
//         GenerateCourse,
//       ],
//     }).onRequest({ req, res });
//   }
// });

// // app/api/inngest/route.js
// import { serve } from "inngest/next";
// import { inngest } from "../../../inngest/client";
// import { CreateNewUser, GenerateCourse, GenerateNotes, GenerateStudyTypeContent, helloWorld } from "@/inngest/functions";

// export const { GET, POST, PUT } = serve({
//   client: inngest,
//   functions: [helloWorld, CreateNewUser, GenerateCourse, GenerateNotes, GenerateStudyTypeContent],
// });

import { serve } from "inngest/next";
import { inngest } from "../../../inngest/client";
import { CreateNewUser, GenerateCourse, GenerateNotes, GenerateStudyTypeContent, helloWorld } from "@/inngest/functions";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [helloWorld, CreateNewUser, GenerateCourse, GenerateNotes, GenerateStudyTypeContent],
});
