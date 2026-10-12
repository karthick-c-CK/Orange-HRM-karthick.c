import { ApiClient } from './api.client';
import { ROUTES } from '../utils/constants';
import {
  EmployeeSearchResponse,
  JobDetailsResponse,
  PersonalDetailsResponse,
} from '../types/api.types';
import { ApiResult } from '../types/api.types';

/** Domain-level access to the OrangeHRM employee endpoints. */
export class OrangeHrmApi {
  private readonly client: ApiClient;

  constructor(client: ApiClient) {
    this.client = client;
  }

  searchEmployeesById(employeeId: string): Promise<ApiResult<EmployeeSearchResponse>> {
    return this.client.get<EmployeeSearchResponse>(ROUTES.apiEmployees, {
      nameOrId: employeeId,
      limit: 50,
      offset: 0,
    });
  }

  getPersonalDetails(empNumber: number): Promise<ApiResult<PersonalDetailsResponse>> {
    return this.client.get<PersonalDetailsResponse>(ROUTES.apiPersonalDetails(empNumber));
  }

  getJobDetails(empNumber: number): Promise<ApiResult<JobDetailsResponse>> {
    return this.client.get<JobDetailsResponse>(ROUTES.apiJobDetails(empNumber));
  }
}