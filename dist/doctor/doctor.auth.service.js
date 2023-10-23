"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.DoctorAuth = void 0;
const bcrypt = __importStar(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class DoctorAuth {
    constructor(prismaService) {
        this.prismaService = prismaService;
    }
    register(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const isExist = yield this.prismaService.doctor.findFirst({
                where: {
                    email: data.email,
                },
            });
            if (isExist) {
                return {
                    code: 409,
                    response: "User already registered",
                };
            }
            const response = yield this.prismaService.doctor.create({
                data: Object.assign(Object.assign({}, data), { password: bcrypt.hashSync(data.password, Number(process.env["HASH_SALT"])) }),
            });
            response.password = "";
            if (response) {
                return {
                    code: 201,
                    response: response,
                };
            }
            return {
                code: 400,
                response: "Bad Request",
            };
        });
    }
    login(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.prismaService.doctor.findFirst({
                where: {
                    email: data.email,
                },
            });
            if (response) {
                const passwordMatch = bcrypt.compareSync(data.password, response.password);
                if (!passwordMatch) {
                    return {
                        code: 401,
                        response: "Incorrect Password",
                    };
                }
                const payload = {
                    email: response.email,
                    name: response.name,
                };
                const token = jsonwebtoken_1.default.sign(payload, String(process.env["JWT_KEY"]), {
                    expiresIn: "24h",
                    algorithm: "HS256",
                });
                return {
                    code: 200,
                    response: token,
                };
            }
            return {
                code: 404,
                response: "Username not found",
            };
        });
    }
}
exports.DoctorAuth = DoctorAuth;
//# sourceMappingURL=doctor.auth.service.js.map