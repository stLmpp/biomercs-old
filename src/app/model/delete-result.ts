export interface DeleteResultRaw {
  fieldCount: number;
  affectedRows: number;
  insertId: number;
  serverStatus: number;
  warningCount: number;
  message: string;
  protocol41: boolean;
  changedRows: number;
}

export interface DeleteResult {
  raw: DeleteResultRaw;
  affected?: number;
}
