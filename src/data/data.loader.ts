import * as fs from 'fs';
import * as path from 'path';
import { EmployeeTestData } from '../types/employee.types';

const TEST_DATA_DIR = path.resolve(__dirname, '../../test-data');
const EMPLOYEE_FILE = path.join(TEST_DATA_DIR, 'employees.json');

/**
 * Loads and validates employee records from test-data/employees.json.
 * Profile picture paths are resolved to absolute paths.
 */
export function loadEmployees(filePath: string = EMPLOYEE_FILE): EmployeeTestData[] {
  const raw: unknown = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  if (!Array.isArray(raw) || raw.length === 0) {
    throw new Error(`${filePath} must contain a non-empty array of employee records.`);
  }

  return raw.map((record, index) => toEmployeeTestData(record, index, path.dirname(filePath)));
}

function toEmployeeTestData(record: unknown, index: number, testDataDir: string): EmployeeTestData {
  const context = `employees.json[${index}]`;

  if (typeof record !== 'object' || record === null) {
    throw new Error(`${context} must be an object.`);
  }

  const data = record as Record<string, unknown>;
  const jobDetails = (data.jobDetails ?? {}) as Record<string, unknown>;
  const pictureRelativePath = requireString(data.profilePicture, `${context}.profilePicture`);
  const profilePicture = path.resolve(testDataDir, pictureRelativePath);

  if (!fs.existsSync(profilePicture)) {
    throw new Error(
      `Profile picture for ${context} not found at ${profilePicture}. ` +
        'Add the image file before running the suite.',
    );
  }

  return {
    firstName: requireString(data.firstName, `${context}.firstName`),
    lastName: requireString(data.lastName, `${context}.lastName`),
    employeeIdPrefix: requireString(data.employeeIdPrefix, `${context}.employeeIdPrefix`),
    profilePicture,
    jobDetails: {
      jobTitle: requireString(jobDetails.jobTitle, `${context}.jobDetails.jobTitle`),
      employmentStatus: requireString(
        jobDetails.employmentStatus,
        `${context}.jobDetails.employmentStatus`,
      ),
    },
  };
}

function requireString(value: unknown, fieldName: string): string {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`Missing or empty value for "${fieldName}".`);
  }
  return value.trim();
}