import { CreateCollaboratorDto } from './create-collaborator.dto';
export declare class CreateProjectDto {
    name: string;
    idCustomer: number;
    description: string;
    accountable: string;
    value: number;
    airtableUrl: string;
    airtableIframeUrl: string;
    startDate: Date;
    endDate: Date;
    collaborators: CreateCollaboratorDto[];
}
