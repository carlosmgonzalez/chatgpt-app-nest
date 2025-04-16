import { BadRequestException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as sharp from 'sharp';

export const downloadImageAsPng = async (
  url: string,
  fullPath: boolean = false,
) => {
  try {
    const response = await fetch(url);

    if (!response.ok) throw new BadRequestException('Error to download image');

    const folderPath = path.resolve('./', './generated/images');
    fs.mkdirSync(folderPath, { recursive: true });

    const imageName = `${new Date().getTime()}.png`;
    const imagePath = path.join(folderPath, imageName);

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    await sharp(buffer).png().ensureAlpha().toFile(imagePath);

    return fullPath ? imagePath : imageName;
  } catch (error) {
    console.log(error);
  }
};

export const downloadBase64ImageAsPng = async (
  base64Image: string,
  fullPath: boolean = false,
) => {
  try {
    const folderPath = path.resolve('./', './generated/images');
    fs.mkdirSync(folderPath, { recursive: true });

    const imageName = `${new Date().getTime()}-64.png`;
    const imagePath = path.join(folderPath, imageName);

    base64Image = base64Image.split(';base64').pop()!;
    const buffer = Buffer.from(base64Image, 'base64');

    await sharp(buffer).png().ensureAlpha().toFile(imagePath);

    return fullPath ? imagePath : imageName;
  } catch (error) {
    console.log(error);
  }
};
