const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");
require('dotenv').config();

const app = express();



app.use(cors());
app.use(express.json());

app.use("/api", authRoutes);
app.use("/users", userRoutes);
app.use("/tasks", taskRoutes);


mongoose.connect('mongodb://localhost:27017/task-management', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('Error connecting to MongoDB:', err));



app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});