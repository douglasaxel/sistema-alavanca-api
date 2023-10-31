import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PrismaService } from 'src/database/prisma.service';
import { FindAllProjectDto } from './dto/find-all-projects.dto';
import { CreateCollaboratorDto } from './dto/create-collaborator.dto';
export declare class ProjectsService {
    private prismaService;
    constructor(prismaService: PrismaService);
    create({ collaborators, ...createData }: CreateProjectDto, driveFolderId: string): import(".prisma/client").Prisma.Prisma__ProjectClient<{
        id: number;
        idCustomer: number;
        name: string;
        description: string;
        accountable: string;
        value: number;
        airtableUrl: string;
        airtableIframeUrl: string;
        driveFolderId: string;
        status: import(".prisma/client").$Enums.ProjectStatus;
        startDate: Date;
        endDate: Date;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findAll({ name, startDate, endDate, customerId, collaborators, }: FindAllProjectDto): import(".prisma/client").Prisma.PrismaPromise<({
        collaborators: {
            id: number;
            idProject: number;
            name: string;
            email: string;
            createdAt: Date;
        }[];
        customer: {
            id: number;
            image: string;
            name: string;
            phone: string;
            email: string;
            cnpj: string;
            accountable: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date;
        };
    } & {
        id: number;
        idCustomer: number;
        name: string;
        description: string;
        accountable: string;
        value: number;
        airtableUrl: string;
        airtableIframeUrl: string;
        driveFolderId: string;
        status: import(".prisma/client").$Enums.ProjectStatus;
        startDate: Date;
        endDate: Date;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date;
    })[]>;
    findOne(id: number): import(".prisma/client").Prisma.Prisma__ProjectClient<{
        collaborators: {
            id: number;
            email: string;
            name: string;
        }[];
        customer: {
            id: number;
            name: string;
        };
    } & {
        id: number;
        idCustomer: number;
        name: string;
        description: string;
        accountable: string;
        value: number;
        airtableUrl: string;
        airtableIframeUrl: string;
        driveFolderId: string;
        status: import(".prisma/client").$Enums.ProjectStatus;
        startDate: Date;
        endDate: Date;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date;
    }, null, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: number, updateData: UpdateProjectDto): import(".prisma/client").Prisma.Prisma__ProjectClient<{
        id: number;
        idCustomer: number;
        name: string;
        description: string;
        accountable: string;
        value: number;
        airtableUrl: string;
        airtableIframeUrl: string;
        driveFolderId: string;
        status: import(".prisma/client").$Enums.ProjectStatus;
        startDate: Date;
        endDate: Date;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    createCollaborators(id: number, collaborator: CreateCollaboratorDto): Promise<{
        id: number;
        idProject: number;
        name: string;
        email: string;
        createdAt: Date;
    }>;
    removeCollaborators(idProject: number, idCollaborator: number): Promise<{
        id: number;
        idProject: number;
        name: string;
        email: string;
        createdAt: Date;
    }>;
    remove(id: number): import(".prisma/client").Prisma.Prisma__ProjectClient<{
        id: number;
        idCustomer: number;
        name: string;
        description: string;
        accountable: string;
        value: number;
        airtableUrl: string;
        airtableIframeUrl: string;
        driveFolderId: string;
        status: import(".prisma/client").$Enums.ProjectStatus;
        startDate: Date;
        endDate: Date;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}
