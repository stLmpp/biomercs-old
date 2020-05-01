export interface UpdateResultRaw {
  fieldCount: number;
  affectedRows: number;
  insertId: number;
  serverStatus: number;
  warningCount: number;
  message: string;
  protocol41: boolean;
  changedRows: number;
}

export interface UpdateResult {
  raw: UpdateResultRaw;
  affected?: number;
  generatedMaps: any[];
}



