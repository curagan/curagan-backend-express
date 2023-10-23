import { PrismaService } from "../prisma.service";
import { DoctorLogin, DoctorRegister } from "./doctor.interface";
export declare class DoctorAuth {
    private readonly prismaService;
    constructor(prismaService: PrismaService);
    register(data: DoctorRegister): Promise<{
        code: number;
        response: string;
    } | {
        code: number;
        response: {
            id: string;
            email: string;
            specialization: string;
            password: string;
            name: string;
            imageURL: string;
            location: string;
            hospital: string;
            schedule: string | null;
        };
    }>;
    login(data: DoctorLogin): Promise<{
        code: number;
        response: string;
    }>;
}
