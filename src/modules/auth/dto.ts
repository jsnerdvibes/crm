// src/modules/auth/dto.ts

export interface RegisterDTO {
  tenantName: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
  tenantId: string;
  adminUserId: string;
}
