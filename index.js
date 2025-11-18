const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

// middle
app.use(cors());
app.use(express.json());

// test server running or not
app.get("/", (req, res) => {
    res.send("Server Running");
});

app.listen(port, () => {
    console.log(`server running on port number ${port}`);
});
