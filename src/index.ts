import express from "express";
import cors from "cors";
import { doctorRouter } from "./doctor/doctor.router";
import { patientRouter } from "./patient/patient.router";
import { appointmentRouter } from "./appointments/appointments.router";
import { NotificationService } from "./notification/notification.service";
import { PrismaService } from "./prisma.service";
import { Server } from "socket.io";
import { createServer } from "http";
import { notificationRouter } from "./notification/notification.router";

interface Data {
	role: string;
	userId: string;
}

interface PatientDoctor {
	senderId: string;
	senderRole: string;
	targetId: string;
	targetRole: string;
	message: string;
	appointmentId: string;
}

const app = express();
const port = process.env.PORT || 4000;
const prismaService = new PrismaService();
const notificationService = new NotificationService(prismaService);

app.use(express.json());
app.use(cors());

const server = createServer(app);
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

app.use("/doctor", doctorRouter);
app.use("/patient", patientRouter);
app.use("/appointments", appointmentRouter);
app.use("/notification", notificationRouter);

server.listen(port, () => {
	console.log(`Server run at ${port}`);
});
