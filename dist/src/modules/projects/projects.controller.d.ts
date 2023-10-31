import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { FindAllProjectDto } from './dto/find-all-projects.dto';
import { CreateCalendarEventDto } from './dto/create-calendar-event.dto';
import { CreateCollaboratorDto } from './dto/create-collaborator.dto';
export declare class ProjectsController {
    private readonly projectsService;
    constructor(projectsService: ProjectsService);
    create(createProjectDto: CreateProjectDto): Promise<{
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
    }>;
    createEvent(id: number, { startDate, endDate }: CreateCalendarEventDto): Promise<any>;
    findAll(findAllProjectDto: FindAllProjectDto): Promise<any[]>;
    findOne(id: string): Promise<{
        tasks: {
            todo: number;
            doing: number;
            done: number;
            total: number;
        };
        googleFiles: import("googleapis").drive_v3.Schema$File[];
        googleCalendar: any[];
        collaborators: {
            id: number;
            email: string;
            name: string;
        }[];
        customer: {
            id: number;
            name: string;
        };
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
    }>;
    update(id: string, updateProjectDto: UpdateProjectDto): import(".prisma/client").Prisma.Prisma__ProjectClient<{
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
    addCollaborators(id: number, createCollaboratorDto: CreateCollaboratorDto): Promise<{
        id: number;
        idProject: number;
        name: string;
        email: string;
        createdAt: Date;
    }>;
    removeCollaborators(id: number, idCollaborator: number): Promise<any>;
    remove(id: string): import(".prisma/client").Prisma.Prisma__ProjectClient<{
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
