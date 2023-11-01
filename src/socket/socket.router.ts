import { Server as SocketIoServer } from "socket.io";

const socketRouter = (io: SocketIoServer) => {
	io.on("connection", (socket) => {
		console.log("A user connected");

		socket.on("join", (userType: string, userID: string) => {
			const room = `${userType}-${userID}`;
			socket.join(room);
			console.log(socket.id);
			io.emit("join", socket.id);
		});

		socket.on("disconnect", () => {
			console.log("User disconnected");
		});
	});
};

export { socketRouter };
