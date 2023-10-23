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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorService = void 0;
class DoctorService {
    constructor(prismaService) {
        this.prismaService = prismaService;
    }
    getAllDoctor() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.prismaService.doctor.findMany();
            response.map((res) => {
                res.password = "";
            });
            return {
                code: 200,
                response: response,
            };
        });
    }
    getDoctorByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.prismaService.doctor.findMany({
                where: {
                    name: name,
                },
            });
            response.map((res) => {
                res.password = "";
            });
            return {
                code: 200,
                response: response,
            };
        });
    }
}
exports.DoctorService = DoctorService;
//# sourceMappingURL=doctor.service.js.map