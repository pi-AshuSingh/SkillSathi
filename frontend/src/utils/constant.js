const isProduction = import.meta.env.MODE === 'production';
export const API_BASE_URL = isProduction ? "https://skillsathi-z5tw.onrender.com" : "http://localhost:8000";

export const USER_API_END_POINT = `${API_BASE_URL}/api/v1/user`;
export const JOB_API_END_POINT = `${API_BASE_URL}/api/v1/job`;
export const APPLICATION_API_END_POINT = `${API_BASE_URL}/api/v1/application`;
export const COMPANY_API_END_POINT = `${API_BASE_URL}/api/v1/company`;