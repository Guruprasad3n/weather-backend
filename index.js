const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();
var Key = `fbaca50e2db19b4d58cc42e0abbb809a`;
const { createChat, CancelledCompletionError } = require("completions");

const PORT = process.env.PORT || 8080;

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Home");
});

// const chat = createChat({
//     apiKey: process.env.OPENAI_API_KEY,
//     model: "gpt-3.5-turbo-0613",
//     functions: [
//       {
//         name: "sum_of_two_numbers",
//         description: "Calculate the sum of two integers",
//         parameters: {
//           type: "object",
//           properties: {
//             firstNumber: {
//               type: "integer",
//               description: "The first integer",
//             },
//             secondNumber: {
//               type: "integer",
//               description: "The second integer",
//             },
//           },
//           required: ["firstNumber", "secondNumber"],
//         },
//         function: async ({ firstNumber, secondNumber }) => {
//           const sum = firstNumber + secondNumber;
//           return {
//             result: sum,
//           };
//         },
//       },
//     ],
//     functionCall: "auto",
//   });

const chat = createChat({
  apiKey: process.env.OPENAI_API_KEY,
  model: "gpt-3.5-turbo-0613",
  functions: [
    {
      name: "get_current_weather",
      description: "Get the current weather in a given location",
      parameters: {
        type: "object",
        properties: {
          location: {
            type: "string",
            description: "The city and state, e.g. San Francisco, CA",
          },
          unit: { type: "string", enum: ["celsius", "fahrenheit"] },
        },
        required: ["location"],
      },
      function: async ({ location }) => {
        let res_single = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${Key}&units=metric&sys=unix`
        );
        let data = await res_single.json();
        return {
          location: data.name, //weather api
          temperature: data.main.temp, //weather api
          unit: "celsius",
        };
      },
    },
  ],
  functionCall: "auto",
});

// app.get("/", (req, res) => {
//   res.send("Home");
// });

app.post("/get-response", async (req, res) => {
  const chatUser = req.body;
  const getResponse = await chat.sendMessage(chatUser);
  console.log(getResponse.content);
  return res.send(getResponse.content);
});

async function main() {
  try {
    const response = await chat.sendMessage("What is the sum of 10 and 18?");
    console.log(response.content);
    // Output: "14 is the sum of them."
  } catch (error) {
    console.log("Error", error);
  }
}
main();

app.listen(PORT, (req, res) => {
  console.log(`Server started in port No  http://localhost:${PORT}`);
});
