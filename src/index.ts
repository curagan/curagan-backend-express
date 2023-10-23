import express from "express";
import cors from "cors";
import { doctorRouter } from "./doctor/doctor.router";

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());

app.use("/doctor", doctorRouter);

app.listen(port, () => {
	console.log(`Listening on ${port}`);
});
