export interface EnvironmentVariables {
  DB_NAME: string;
  API_PREFIX: string;
  DB_HOST: string;
  DB_PORT: number;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_SYNC: boolean;
  JWT_SECRET: string;
  JWT_EXPIRE: string;
  DB_CACHE: number;
  DB_LOGIN_TYPE: string;
  DB_REJECT_UNAUTHORIZE: boolean;
}
