import { AppointmentType } from '@prisma/client';
export declare class CreateAppointmentDto {
    consultantId: string;
    caseId?: string;
    type: AppointmentType;
    scheduledAt: string;
    durationMin?: number;
    notes?: string;
}
