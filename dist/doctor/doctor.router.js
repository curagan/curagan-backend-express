"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.doctorRouter = void 0;
const express_1 = __importDefault(require("express"));
const prisma_service_1 = require("../prisma.service");
const doctor_auth_service_1 = require("./doctor.auth.service");
const doctor_service_1 = require("./doctor.service");
const prismaService = new prisma_service_1.PrismaService();
const doctorAuth = new doctor_auth_service_1.DoctorAuth(prismaService);
const doctorService = new doctor_service_1.DoctorService(prismaService);
const doctorRouter = express_1.default.Router();
exports.doctorRouter = doctorRouter;
doctorRouter.post("auth/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield doctorAuth.register(req.body);
        res.status(response.code).json(response.response);
    }
    catch (err) {
        res.status(500).json(err);
    }
}));
doctorRouter.post("auth/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield doctorAuth.login(req.body);
        res.status(response.code).json(response.response);
    }
    catch (err) {
        res.status(500).json(err);
    }
}));
doctorRouter.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield doctorService.getAllDoctor();
        res.status(response.code).json(response.response);
    }
    catch (err) {
        res.status(500).json(err);
    }
}));
doctorRouter.get("/search/:name", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = req.params.name;
        const response = yield doctorService.getDoctorByName(query);
        res.status(response.code).json(response.response);
    }
    catch (err) {
        res.status(500).json(err);
    }
}));
//# sourceMappingURL=doctor.router.js.map