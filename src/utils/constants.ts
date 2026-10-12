export const ROUTES = {
  login: '/web/index.php/auth/login',
  dashboard: '/web/index.php/dashboard/index',
  employeeList: '/web/index.php/pim/viewEmployeeList',
  addEmployee: '/web/index.php/pim/addEmployee',
  personalDetails: (empNumber: number): string =>
    `/web/index.php/pim/viewPersonalDetails/empNumber/${empNumber}`,
  jobDetails: (empNumber: number): string =>
    `/web/index.php/pim/viewJobDetails/empNumber/${empNumber}`,
  apiEmployees: '/web/index.php/api/v2/pim/employees',
  apiPersonalDetails: (empNumber: number): string =>
    `/web/index.php/api/v2/pim/employees/${empNumber}/personal-details`,
  apiJobDetails: (empNumber: number): string =>
    `/web/index.php/api/v2/pim/employees/${empNumber}/job-details`,
} as const;

export const PERSONAL_DETAILS_URL_PATTERN = /\/pim\/viewPersonalDetails\/empNumber\/(\d+)/;

export const TIMEOUTS = {
  toast: 10_000,
  navigation: 30_000,
} as const;

export const MESSAGES = {
  successSaved: 'Successfully Saved',
  successUpdated: 'Successfully Updated',
  successDeleted: 'Successfully Deleted',
} as const;

export const LABELS = {
  employeeId: 'Employee Id',
  jobTitle: 'Job Title',
  employmentStatus: 'Employment Status',
} as const;

export function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Matches text that equals the given value once surrounding whitespace is trimmed. */
export function exactText(text: string): RegExp {
  return new RegExp(`^\\s*${escapeRegExp(text)}\\s*$`);
}

/** Matches a URL that contains the given path. */
export function pathPattern(path: string): RegExp {
  return new RegExp(escapeRegExp(path));
}