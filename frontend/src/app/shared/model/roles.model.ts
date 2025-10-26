export interface Role {
  id: string;
  name: string;
  createdAt: string; 
  updatedAt: string;
}

export interface RolesResponse {
  success: boolean;
  message: string;
  data: Role[];
}
