import mongoose from "mongoose";
import app from "./app.js";
import dotenv from "dotenv";
import logger from "./logs/logger.js";
import http from 'http'
import NotificationSocket from "./Socket/NotificationSocket.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

const server = http.createServer(app)
new NotificationSocket(server)

// DB Connection
mongoose.connect(MONGO_URI)
    .then(() => {
        logger.info("MongoDB Connected ✔");

        server.listen(PORT, () => {
            logger.info(`Server running on port ${PORT} 🚀`);
        });
    })
    .catch(err => {
        logger.error("DB Connection Error ❌", err);
    });
