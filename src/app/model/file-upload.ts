export interface FileUpload {
  id: number;
  originalFilename: string;
  filename: string;
  extension: string;
  size: number;
  mimetype: string;
  destination: string;
  path: string;
  url: string;
}
