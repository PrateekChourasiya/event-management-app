const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require('cors');
require("dotenv").config();
const main = require("./config/db");
const authRouter = require("./routes/authRoutes");
const eventRouter = require("./routes/eventRoutes");
const app = express();

app.use(cors({
    origin: 'http://localhost:5173', // Vite default port
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'dist')))

app.get("/test", (req, res) => {
  res.send("Hello from Backend");
});

app.use("/api/user", authRouter);
app.use("/api/event", eventRouter);

app.use('*', (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"))
})

async function initializeConnection() {
  try {
    await Promise.all([main()]);
    console.log("DB Connected");

    app.listen(process.env.PORT, () => {
      console.log("Server is listening at Port:" + process.env.PORT);
    });
  } catch (err) {
    console.log("Error Occurred: " + err);
  }
}

initializeConnection();