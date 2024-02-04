const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
app.use(express.json()); // Parse JSON requests

mongoose.connect('mongodb+srv://rei:7ToKWMsUC7bFrmu8@forumandinformationweb.qkipuj9.mongodb.net/crud');

const MessageSchema = new mongoose.Schema({
    name: String,
    message: String,
    comments: [String] // Change the data type to an array
});

const MessageModel = mongoose.model("messages", MessageSchema);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to get all messages
app.get("/getMessages", async (req, res) => {
    try {
        const messages = await MessageModel.find({});
        res.json(messages);
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
});

// Endpoint to add a new message
app.post("/addMessage", async (req, res) => {
    const { name, message } = req.body;

    if (!name || !message) {
        return res.status(400).json({ error: "Name and message are required" });
    }

    try {
        const newMessage = new MessageModel({
            name,
            message,
            comments: []
        });

        await newMessage.save();
        res.json({ success: true });
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
});

// Endpoint to remove a message
app.delete("/removeMessage/:id", async (req, res) => {
    const messageId = req.params.id;

    try {
        await MessageModel.findByIdAndRemove(messageId);
        res.json({ success: true });
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
});

// Endpoint to add a comment to a message
app.post("/addComment/:id", async (req, res) => {
    const messageId = req.params.id;
    const { comment } = req.body;

    if (!comment) {
        return res.status(400).json({ error: "Comment is required" });
    }

    try {
        const message = await MessageModel.findById(messageId);
        message.comments.push(comment);
        await message.save();
        res.json({ success: true });
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
});

// Serve the index.html file for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
