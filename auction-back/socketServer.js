import {Server} from "socket.io";
import http from "http";
import SocketController from "./controllers/socket/SocketController.js";

export default function setupSocketServer(app, db) {
    const server = http.createServer(app);
    const io = new Server(server, {
        cors: {
            origin: "*",
        },
    });

    io.use((socket, next) =>
        SocketController.authenticateSocketToken(socket, next, db)
    );

    io.on("connection", (socket) => SocketController.connectionToLot(socket, io));

    return server;
}
