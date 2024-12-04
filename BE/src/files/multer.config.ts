import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { MulterModuleOptions, MulterOptionsFactory } from "@nestjs/platform-express";
import * as fs from "fs";
import multer, { diskStorage } from "multer";
import * as path from "path";
import { join } from "path";

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
    getRootPath = () => process.cwd();

    ensureExists(targetDirectory: string) {
        fs.mkdir(targetDirectory, { recursive: true }, (error) => {
            if (error) {
                console.error(error);
            } else {
                console.log("Directory successfully created...");
            }
        });
    }

    createMulterOptions(): MulterModuleOptions {
        return {
            storage: diskStorage({
                destination: (req, file, cb) => {
                    const folder = req?.headers?.folder_type ?? "default";
                    this.ensureExists(`public/images/${folder}`);
                    cb(null, join(this.getRootPath(), `public/images/${folder}`));
                },
                filename: (req, file, cb) => {
                    const extName = path.extname(file.originalname);
                    const baseName = path.basename(file.originalname, extName);
                    const finalName = `${baseName}-${Date.now()}${extName}`;
                    cb(null, finalName);
                }
            }),
            fileFilter: (req, file, cb) => {
                const allowedFileTypes = ['jpg', 'jpeg', 'png', 'gif', 'pdf'];
                const fileExtension = file.originalname.split('.').pop().toLowerCase();
                const isValidFileType = allowedFileTypes.includes(fileExtension);

                if (!isValidFileType) {
                    cb(new HttpException('Invalid file type', HttpStatus.UNPROCESSABLE_ENTITY), false);
                } else {
                    cb(null, true);
                }
            },
            limits: {
                fileSize: 1024 * 1024 * 5 // 5MB per file
            }
        };
    }
    static memoryStorageConfig() {
        return {
          storage: multer.memoryStorage(),
          limits: { fileSize: 3 * 1024 * 1024 },
          fileFilter: (req, file, callback) => {
            // Chỉ cho phép upload file hình ảnh
            const allowedMimes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!allowedMimes.includes(file.mimetype)) {
              return callback(new Error('Only image files are allowed'), false);
            }
            callback(null, true);
        },
    };
      
}
}


