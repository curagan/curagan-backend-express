import express from "express";
import cors from "cors";
import { doctorRouter } from "./doctor/doctor.router";
import { patientRouter } from "./patient/patient.router";
import { appointmentRouter } from "./appointments/appointments.router";
import { createServer } from "http";
import { notificationRouter } from "./notification/notification.router";
import initSocket from "./socket/socket.router";

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());

const server = createServer(app);
initSocket(server);

app.use("/doctor", doctorRouter);
app.use("/patient", patientRouter);
app.use("/appointments", appointmentRouter);
app.use("/notification", notificationRouter);

server.listen(port, () => {
	console.log(`Server run at ${port}`);
});
