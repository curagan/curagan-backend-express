import express from "express";
import cors from "cors";
import { doctorRouter } from "./doctor/doctor.router";
import { patientRouter } from "./patient/patient.router";
import { appointmentRouter } from "./appointments/appointments.router";

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());

app.use("/doctor", doctorRouter);
app.use("/patient", patientRouter);
app.use("/appointments", appointmentRouter);

app.listen(port, () => {
	console.log(`Listening on ${port}`);
});
