import { Server } from "socket.io";
import { Server as httpServer } from "http";
import { Data, PatientDoctor } from "./socket.interface";
import { NotificationService } from "../notification/notification.service";
import { PrismaService } from "../prisma.service";

const prismaService = new PrismaService();
const notificationService = new NotificationService(prismaService);

const initSocket = (server: httpServer) => {
	const io = new Server(server, {
		cors: {
			origin: true,
			methods: ["GET", "POST"],
			allowedHeaders: ["my-custom-header"],
			credentials: true,
		},
	});

	io.on("connection", (socket) => {
		socket.on("identifyUser", (data: Data) => {
			socket.join(data.userId);
		});

		socket.on("createAppointment", async (data: PatientDoctor) => {
			const userId = data.targetId;
			const response = await notificationService.createNotification(data);
			if (response) {
				io.to(userId).emit("notification", {
					...data,
					notificationId: response.response,
				});
			}
		});
	});
};

export default initSocket;
