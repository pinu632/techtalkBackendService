import { Server } from "socket.io";

export default class NotificationSocket {
    static instance = null;

    constructor(server) {
        if (NotificationSocket.instance) {
            return NotificationSocket.instance;
        }

        this.io = new Server(server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"],
                credentials: true,
            },
        });

        this.userMap = new Map(); // userId → socketId

        this.initialize();

        NotificationSocket.instance = this;
    }

    static getInstance() {
        return NotificationSocket.instance;
    }

    initialize() {
        this.io.on("connection", (socket) => {
            console.log("A user connected:", socket.id);

            socket.on("register_user", (userId) => {
                const userIdString = String(userId)
                this.userMap.set(userIdString, socket.id);

                // join userId room
                socket.join(userIdString);

                console.log(`User ${userId} joined room, socket=${socket.id}`);
            });

            socket.on("disconnect", () => {
                console.log("A user disconnected:", socket.id);

                // remove userId for this socketId
                for (const [userId, sId] of this.userMap.entries()) {
                    if (sId === socket.id) {
                        this.userMap.delete(userId);
                        console.log(`User ${userId} removed from userMap`);
                        break;
                    }
                }
            });
        });
    }

    getSocketId(userId) {
        console.log(userId + "  type " + typeof userId)
        console.log(`Getting socket ID for user ${userId}`);

        for (const [uid, socketId] of this.userMap.entries()) {
            console.log(`User ${uid} has socket ID ${socketId}`);
        }

        const socketId = this.userMap.get(userId.toString());
        if (!socketId) {
            console.log(`User ${userId} not connected.`);
            return;
        }

        console.log(`User ${userId} has socket ID ${socketId}`);    

        return socketId;
    }


    sendToUser(userId, payload) {
        console.log(userId + "  type " + typeof userId)
        const socketId = this.getSocketId(userId);
        if (!socketId) {
            console.log(`User ${userId} not connected.`);
            return;
        }

        this.io.to(socketId).emit("new_notification", payload);
        console.log(`Notification sent to user ${userId} on socket ${socketId}`);
    }

    sendToRole(role, payload) {
        this.io.to(role).emit("role_notification", payload);
    }
}
