export interface ApiResult<T> {
  status: number;
  ok: boolean;
  body: T | undefined;
}

export interface ApiListResponse<T> {
  data: T[];
}

export interface ApiItemResponse<T> {
  data: T | null;
}

export interface EmployeeSearchItem {
  empNumber: number;
  employeeId: string;
  firstName: string;
  lastName: string;
}

export interface PersonalDetails {
  empNumber: number;
  employeeId: string;
  firstName: string;
  lastName: string;
}

export interface JobDetails {
  jobTitle: { id: number; title: string } | null;
  empStatus: { id: number; name: string } | null;
}

export type EmployeeSearchResponse = ApiListResponse<EmployeeSearchItem>;
export type PersonalDetailsResponse = ApiItemResponse<PersonalDetails>;
export type JobDetailsResponse = ApiItemResponse<JobDetails>;