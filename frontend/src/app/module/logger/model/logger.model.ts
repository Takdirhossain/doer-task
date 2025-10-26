import { Pagination } from "@app/module/login-log/model/login-log.model";

export interface LoggerResponse {
  success: boolean;
  message: string;
  data: {
    logs: Log[];
    pagination: Pagination;
  };
}

export interface Log {
  id: string;
  userId: string;
  userName: string;
  level: string;
  category: string;
  action: string;
  ipAddress: string;
  message: string;
  method: string;
  path: string;
  meta: any;
  createdAt: string;  
  deletedAt: string | null;
}


