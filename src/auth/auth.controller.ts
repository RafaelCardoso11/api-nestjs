import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Res,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthLoginDTO } from './dto/auth-login.dto';
import { AuthRegisterDTO } from './dto/auth-register.dto';
import { AuthForgetDTO } from './dto/auth-forget.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { UserByRequest } from 'src/decorators/user-by-request.decorator';
import {
  FileFieldsInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { User } from '@prisma/client';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  async login(@Body() body: AuthLoginDTO) {
    return this.authService.login(body);
  }

  @Post('/register')
  async register(@Body() body: AuthRegisterDTO) {
    return this.authService.register(body);
  }

  @Post('/forget')
  async forget(@Body() body: AuthForgetDTO) {
    return this.authService.forget(body);
  }

  @UseGuards(AuthGuard)
  @Post('/resetpassword')
  async resetPassword(@Body('password') password, @UserByRequest('id') id) {
    return this.authService.resetPassword({ password, id });
  }

  @UseGuards(AuthGuard)
  @Post('/verifyToken')
  async me(@UserByRequest() user) {
    return {
      user,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/photo')
  async downloadPhoto(
    @UserByRequest() user: User,
    @Body('extension') extension: string,
    @Res() res: Response,
  ) {
    const contentType = `image/${extension}`;

    const file = await this.authService.downloadPhoto(user, extension);

    res.setHeader('Content-Type', contentType);
    res.send(file);
  }

  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(AuthGuard)
  @Post('/photo')
  async uploadPhoto(
    @UserByRequest() user: User,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: 'image' }),
          new MaxFileSizeValidator({ maxSize: 1024 * 100 }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.authService.uploadPhoto(user, file);
  }

  @UseInterceptors(FilesInterceptor('files'))
  @UseGuards(AuthGuard)
  @Post('/photos')
  async uploadPhotos(
    @UserByRequest() user: User,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: 'image' }),
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 }),
        ],
      }),
    )
    files: Express.Multer.File[],
  ) {
    return this.authService.uploadFiles(user, files);
  }

  @UseInterceptors(
    FileFieldsInterceptor([
      {
        name: 'images',
        maxCount: 3,
      },
      {
        name: 'documents',
        maxCount: 2,
      },
    ]),
  )
  @UseGuards(AuthGuard)
  @Post('/files-fields')
  async uploadFilesFields(
    @UserByRequest() user: User,
    @UploadedFiles()
    files: {
      images: Express.Multer.File[];
      documents: Express.Multer.File[];
    },
  ) {
    return Promise.all([
      this.authService.uploadFiles(user, files.documents),
      this.authService.uploadFiles(user, files.images),
    ]);
  }
}
