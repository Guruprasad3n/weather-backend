const express = require("express");
const cors = require("cors");
const app = express();

require("dotenv").config();
const { createChat, CancelledCompletionError } = require("completions");

const PORT = process.env.PORT;
app.use(express.json());
app.use(cors());

var Key = process.env.OPEN_WEATHER_API;

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

app.get("/", (req, res) => {
  res.send("Home");
});

app.post("/get-response", async (req, res) => {
  const { message } = req.body;
  try {
    const response = await chat.sendMessage(message);
    console.log(response.content);
    return res.send(response.content);
  } catch (error) {
    console.log("Error in Getting Weather", error);
  }
});

// async function main() {
//   const response = await chat.sendMessage("What is the weather in Delhi?");

//   console.log(response.content);
// }
// main();

app.listen(PORT, (req, res) => {
  console.log(`Server started in port No  http://localhost:${PORT}`);
});
