export interface LoginLog {
  id: string;
  userId: string;
  ipAddress: string;
  userAgent: string;
  message: string;
  actionTime: string;    
  actionType: string;
  status: string;
  createdAt: string;      
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface LogData {
  logs: LoginLog[];
  pagination: Pagination;
}

export interface GetLogsResponse {
  success: boolean;
  message: string;
  data: LogData;
}
