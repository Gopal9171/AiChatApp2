import express from "express";
import cors from "cors";
import ImageKit from "imagekit";
import dotenv from 'dotenv';
import mongoose from "mongoose";
import Chat from "./models/chat.js";
import UserChats from "./models/userChat.js";
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';


dotenv.config();

const port = process.env.PORT || 3000;
const app = express();
// console.log(process.env.CLIENT_URL);
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials:true,
}));

app.use(express.json());

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO);
        console.log("connected to mongoDB");
    } catch (err) {
        console.log(err);
    }
};

const imagekit = new ImageKit({
    urlEndpoint: process.env.VITE_IMAGE_KIT_ENDPOINT,
    publicKey: process.env.VITE_IMAGE_KIT_PUBLIC_KEY,
    privateKey: process.env.VITE_IMAGE_KIT_PRIVATE_KEY
});

app.get("/api/upload", (req, res) => {
    var result = imagekit.getAuthenticationParameters();
    console.log("result is -> ", result);
    return res.send(result);
});

// app.get("/api/test", ClerkExpressRequireAuth(), (req, res)=>{
//     const userId  = req.auth.userId;
//     console.log(userId);

//     res.send("Success");
// })


app.post("/api/chats", ClerkExpressRequireAuth(),async (req, res) => {
    const userId  = req.auth.userId;
    const { text } = req.body;
    console.log("userId", userId);
    console.log("text", text);
    
    if (!userId || !text) {
        return res.status(400).json({ error: "Missing userId or text" });
    }

    try {
        const newChat = new Chat({
            userId: userId,
            history: [{ role: "user", parts: [{ text }] }]
        });

        const savedChat = await newChat.save();

        const userChats = await UserChats.find({ userId: userId });

        if (userChats.length === 0) {
            const newUserChats = new UserChats({
                userId: userId,
                chats: [
                    {
                        _id: savedChat._id,
                        title: text.substring(0, 20),
                    }
                ]
            });
            await newUserChats.save();
        }
       else {
            await UserChats.updateOne(
                { userId: userId },
                {
                    $push: {
                        chats: [
                            {
                                _id: savedChat._id,
                                title: text.substring(0, 20),
                            }
                        ]
                    }
                }
            );
        }

        res.status(200).json({ message: "Chat created successfully", chatId: savedChat._id });
    } catch (err) {
        console.error("Error creating chat:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.get("/api/userchats",ClerkExpressRequireAuth(), async (req, res)=>{
    const userId  = req.auth.userId;


    try {
        const userChats = await UserChats.find({userId});
        console.log(userChats)
        res.status(200).send(userChats[0].chats);
        
    } catch (err) {
        console.log(err);
        res.status(500).send("Error in fetching userchats")
    }
})
// app.get("/api/chats/:id",ClerkExpressRequireAuth(), async (req, res)=>{
//     const userId  = req.auth.userId;


//     try {
//         const chat = await Chat.findOne({_id: req.params.id, userId});
//         console.log(chat)
//         res.status(200).send(chat);
        
//     } catch (err) {
//         console.log(err);
//         res.status(500).send("Error in fetching userchats")
//     }
// })
app.get("/api/chats/:id", ClerkExpressRequireAuth(), async (req, res) => {
    const userId = req.auth.userId;
    const chatId = req.params.id;

    // Validate if chatId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(chatId)) {
        return res.status(400).send("Invalid chat ID");
    }

    try {
        const chat = await Chat.findOne({ _id: chatId, userId });
        if (!chat) {
            return res.status(404).send("Chat not found");
        }
        console.log(chat);
        res.status(200).send(chat);
    } catch (err) {
        console.log(err);
        res.status(500).send("Error in fetching user chats");
    }
});
app.put("/api/chats/:id", ClerkExpressRequireAuth(), async (req, res) => {
    const userId = req.auth.userId;
  
    const { question, answer, img } = req.body;
  
    const newItems = [
      ...(question
        ? [{ role: "user", parts: [{ text: question }], ...(img && { img }) }]
        : []),
      { role: "model", parts: [{ text: answer }] },
    ];
  
    try {
      const updatedChat = await Chat.updateOne(
        { _id: req.params.id, userId },
        {
          $push: {
            history: {
              $each: newItems,
            },
          },
        }
      );
      res.status(200).send(updatedChat);
    } catch (err) {
      console.log(err);
      res.status(500).send("Error adding conversation!");
    }
  });
  

app.use((err, req, res, next) => {
    console.error(err.stack)
   return res.status(401).send('Unauthenticated!')
  })


app.listen(port, () => {
    connect();
    console.log("Server Running on port", port);
});
