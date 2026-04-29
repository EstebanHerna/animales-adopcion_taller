import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Post()           create(@Body() dto: CreateLocationDto) { return this.locationsService.create(dto); }
  @Get()            findAll() { return this.locationsService.findAll(); }
  @Get(':id')       findOne(@Param('id', ParseUUIDPipe) id: string) { return this.locationsService.findOne(id); }
  @Patch(':id')     update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateLocationDto) { return this.locationsService.update(id, dto); }
  @Delete(':id')    remove(@Param('id', ParseUUIDPipe) id: string) { return this.locationsService.remove(id); }
}