export interface CommonColumns {
  id: number;
  creationDate: Date;
  lastUpdateDate?: Date;
  createdBy: number;
  lastUpdatedBy?: number;

  saving?: boolean;
  deleting?: boolean;
  uploading?: boolean;
}
