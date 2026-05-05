import { Module }           from '@nestjs/common';
import { TypeOrmModule }   from '@nestjs/typeorm';
import { MulterModule }    from '@nestjs/platform-express';
import { memoryStorage }   from 'multer';

import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { Animal }           from './entities/animal.entity';
import { Location }         from '../locations/entities/location.entity';
import { User }             from '../users/entities/user.entity';
import { AnimalsService }    from './animals.service';
import { AnimalsController } from './animals.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Animal, Location, User]),
    MulterModule.register({ storage: memoryStorage() }),
    CloudinaryModule,
  ],
  controllers: [AnimalsController],
  providers:   [AnimalsService],
})
export class AnimalsModule {}
