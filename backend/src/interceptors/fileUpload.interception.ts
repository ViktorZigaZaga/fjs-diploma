import * as path from 'path';
import * as uuid from 'uuid';
import { HttpException, HttpStatus, NestInterceptor, Type } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

export function MulterFilesInterceptor(): Type<NestInterceptor> {
  return FilesInterceptor("files", 10, {
    storage: diskStorage({
      destination: path.resolve(__dirname, '../../', '/public/images'),
      filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const filename = `${uuid.v4()}${ext}`;
        cb(null, filename);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (file.mimetype.match(/\.(jpg|jpeg|png|webp)$/) && file.size <= (10^7)) {
        cb(null, true);
      } else {
        cb(
          new HttpException(
            'Разрешены только изображения, максимальным объемом не более 10Мб',
            HttpStatus.BAD_REQUEST
          ),
          false
        );
      }
    }
  })
}
