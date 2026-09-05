import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateScholarshipDto, UpdateScholarshipDto } from './dto/create-scholarship.dto';

@Injectable()
export class ScholarshipsService {
  constructor(private prisma: PrismaService) {}

  async create(createScholarshipDto: CreateScholarshipDto) {
    const data: any = {
      title: createScholarshipDto.title,
      description: createScholarshipDto.description,
      country: createScholarshipDto.country,
      university: createScholarshipDto.university,
      amount: parseFloat(createScholarshipDto.amount.replace(/[^0-9.-]+/g, '')) || 0,
      isActive: createScholarshipDto.isActive ?? true,
    };

    if (createScholarshipDto.deadline) {
      data.deadline = new Date(createScholarshipDto.deadline);
    }

    return this.prisma.adminScholarship.create({ data });
  }

  async findAll(filters: { country?: string; level?: string }) {
    const where: any = { isActive: true };
    
    if (filters.country) {
      where.country = { contains: filters.country, mode: 'insensitive' };
    }

    return this.prisma.adminScholarship.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const scholarship = await this.prisma.adminScholarship.findUnique({
      where: { id },
    });

    if (!scholarship) {
      throw new NotFoundException('Scholarship not found');
    }

    return scholarship;
  }

  async update(id: string, updateScholarshipDto: UpdateScholarshipDto) {
    const existing = await this.prisma.adminScholarship.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Scholarship not found');
    }

    const updateData: any = { ...updateScholarshipDto };
    if (updateScholarshipDto.deadline) {
      updateData.deadline = new Date(updateScholarshipDto.deadline);
    }
    if (updateScholarshipDto.amount) {
      updateData.amount = parseFloat(updateScholarshipDto.amount.replace(/[^0-9.-]+/g, '')) || 0;
    }

    return this.prisma.adminScholarship.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: string) {
    const existing = await this.prisma.adminScholarship.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Scholarship not found');
    }

    return this.prisma.adminScholarship.delete({
      where: { id },
    });
  }
}
