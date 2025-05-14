declare module "exif-parser" {
  interface ExifTags {
    GPSLatitude?: number;
    GPSLongitude?: number;
    GPSLatitudeRef?: "N" | "S";
    GPSLongitudeRef?: "E" | "W";
    [key: string]: any;
  }

  interface ExifResult {
    tags: ExifTags;
  }

  class ExifParser {
    static create(buffer: ArrayBuffer): ExifParser;
    parse(): ExifResult;
  }

  export default ExifParser;
}
