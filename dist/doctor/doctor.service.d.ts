import { PrismaService } from "../prisma.service";
export declare class DoctorService {
    private readonly prismaService;
    constructor(prismaService: PrismaService);
    getAllDoctor(): Promise<{
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
        }[];
    }>;
    getDoctorByName(name: string): Promise<{
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
        }[];
    }>;
}
