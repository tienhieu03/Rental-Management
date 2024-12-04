import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, ParseFilePipeBuilder, HttpStatus, UploadedFiles } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { MulterConfigService } from './multer.config';
import { IUser } from 'src/users/user.interface';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    

  ) { }

  @Public()
  @Post('upload')
  @UseInterceptors(FileInterceptor('imageFile'))
  @ResponseMessage('Upload files!')
  uploadFileOnServer(@UploadedFile() file: Express.Multer.File) {
    return {
      fileName: file.filename
    }
  }


  @Post()
  @UseInterceptors(
    FileInterceptor('imageFile',{
      storage: MulterConfigService.memoryStorageConfig().storage,  // Lấy cấu hình storage từ service
      limits: MulterConfigService.memoryStorageConfig().limits,    // Lấy cấu hình limits từ service
      fileFilter: MulterConfigService.memoryStorageConfig().fileFilter, // Lấy cấu hình fileFilter từ service
    }),
  )
  async uploadFileOnCloud(@UploadedFile() file: Express.Multer.File, @User() user: IUser) {
    if (!file) {
      throw new Error('File not found');
    }

    try {
      const result = await this.filesService.uploadFile(file, user);
      return {
        message: 'File uploaded successfully',
        fileName: result.secure_url, // Trả về URL file sau khi upload
      };
    } catch (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }
  }
 
}
