import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ScholarshipsService } from './scholarships.service';
import { CreateScholarshipDto, UpdateScholarshipDto } from './dto/create-scholarship.dto';
import { AdminGuard } from '../auth/guards/admin.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Scholarships')
@Controller('scholarships')
export class ScholarshipsController {
  constructor(private readonly scholarshipsService: ScholarshipsService) {}

  @Post()
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new scholarship (Admin only)' })
  create(@Body() createScholarshipDto: CreateScholarshipDto) {
    return this.scholarshipsService.create(createScholarshipDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all scholarships' })
  findAll(@Query('country') country?: string, @Query('level') level?: string) {
    return this.scholarshipsService.findAll({ country, level });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a scholarship by ID' })
  findOne(@Param('id') id: string) {
    return this.scholarshipsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a scholarship (Admin only)' })
  update(
    @Param('id') id: string,
    @Body() updateScholarshipDto: UpdateScholarshipDto,
  ) {
    return this.scholarshipsService.update(id, updateScholarshipDto);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a scholarship (Admin only)' })
  remove(@Param('id') id: string) {
    return this.scholarshipsService.remove(id);
  }
}
