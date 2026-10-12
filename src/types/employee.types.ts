export interface JobDetailsInput {
  jobTitle: string;
  employmentStatus: string;
}

/** Shape of a single record in test-data/employees.json, after loading. */
export interface EmployeeTestData {
  firstName: string;
  lastName: string;
  employeeIdPrefix: string;
  /** Absolute path to the profile picture, resolved by the data loader. */
  profilePicture: string;
  jobDetails: JobDetailsInput;
}

export interface NewEmployeeRequest {
  firstName: string;
  lastName: string;
  employeeId: string;
  profilePicturePath: string;
}