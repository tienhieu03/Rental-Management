
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { IUser } from 'src/users/user.interface';
import { Readable } from 'stream';

@Injectable()
export class FilesService {
  constructor(
    private configService: ConfigService,
  ) {
    
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUD_NAME'), 
      api_key: this.configService.get<string>('API_KEY'), 
      api_secret: this.configService.get<string>('API_SECRET'), 
    }); 
  }

  async uploadFile(file: Express.Multer.File, user: IUser ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: user.email? user.email : "default" }, 
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      // Chuyển buffer của file thành stream và upload
      const fileStream = Readable.from(file.buffer);
      fileStream.pipe(uploadStream);
    });
  }
}
