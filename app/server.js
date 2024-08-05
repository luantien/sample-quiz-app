import express from 'express';
import { createServer } from "http";
import _ from 'lodash';
import { createAdapter } from '@socket.io/redis-streams-adapter';
import { Server } from 'socket.io';
import { createClient } from 'redis';

import QUIZ_DATA from './data/data.js';

const activeQuizRooms = {};

const getUniqueId = () => {
    return 'id_' + Math.random().toString(36).substring(2, 16);
}

const app = express();
const httpServer = createServer(app);

//TODO: Update this to use cluster mode for performance scale out
const redisClient = createClient({ url: "redis://localhost:6379" });
await redisClient.connect();

const io = new Server(httpServer, {
    adapter: createAdapter(redisClient),
    // TODO: Update this to the actual domain
    cors: {
        origin: "*",
    }
});


app.get('/room-status', (req, res) => {
    let requestedRoomCode = req.query.qc;

    console.log("Rooms info: ",requestedRoomCode, activeQuizRooms[requestedRoomCode]);
    res.send({
        socket: io.sockets.adapter.rooms,
        room: activeQuizRooms[requestedRoomCode]
    })
});

const listner = httpServer.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${listner.address().port}`);
});

io.on("connection", (socket) => {
    console.log("New client connected");

    socket.on("createRoom", ({ roomCode, hostNickname }) => {
        if (!activeQuizRooms[roomCode]) {
            activeQuizRooms[roomCode] = {
                players: {},
                didQuizStart: false
            };
            socket.join(roomCode);
            io.to(roomCode).emit("roomCreated", hostNickname);
            console.log("Created room:", roomCode, "- host:", hostNickname);
        } else {
            console.log("Error: room", roomCode, "already exists!");
            socket.emit("roomError", "Room already exists");
        }
    })

    socket.on("joinRoom", ({ roomCode, playerName }) => {
        if (activeQuizRooms[roomCode]) {
            socket.join(roomCode);
            let playerUniqueID = getUniqueId();
            socket.playerName = playerName;
            socket.playerUniqueID = playerUniqueID;
            socket.roomCode = roomCode;
            activeQuizRooms[roomCode].players[playerUniqueID] = {
                playerName: playerName,
                playerUniqueID: playerUniqueID,
            };
            io.to(roomCode).emit("playerJoined", {
                "player": playerName,  "onlinePlayers": _.values(activeQuizRooms[roomCode].players)
            });
            console.log("Joined room:", roomCode, "- player:", playerName);
            
        } else {
            console.log("Error: room", roomCode, "not found!");
            socket.emit("roomNotFound", "Room not found");
        }
    });

    socket.on("leaveRoom", ({roomCode, playerName}) => {
        if (activeQuizRooms[socket.roomCode]) {
            let playerUniqueID = socket.playerUniqueID;
            delete activeQuizRooms[socket.roomCode].players[playerUniqueID];
            io.to(roomCode).emit("playerLeft", {
                "player": playerName,  "onlinePlayers": _.values(activeQuizRooms[roomCode].players)
            });
            console.log("Left room:", roomCode, "- player:", playerName);
        }
        else {
            console.log("Error: room", roomCode, "not found!");
            socket.emit("roomNotFound", "Room not found");
        }
    });

    socket.on("disconnect", () => {
        console.log("A client disconnected");
    });
});
