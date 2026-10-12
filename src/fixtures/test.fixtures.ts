import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { DashboardPage } from '../pages/dashboard.page';
import { SidebarComponent } from '../pages/components/sidebar.component';
import { TopbarComponent } from '../pages/components/topbar.component';
import { ToastComponent } from '../pages/components/toast.component';
import { AddEmployeePage } from '../pages/pim/add-employee.page';
import { EmployeeListPage } from '../pages/pim/employee-list.page';
import { JobDetailsPage } from '../pages/pim/job-details.page';
import { ApiClient } from '../api/api.client';
import { OrangeHrmApi } from '../api/orangehrm.api';
import { envConfig } from '../utils/env.config';

type Fixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  sidebar: SidebarComponent;
  topbar: TopbarComponent;
  toast: ToastComponent;
  addEmployeePage: AddEmployeePage;
  employeeListPage: EmployeeListPage;
  jobDetailsPage: JobDetailsPage;
  orangeHrmApi: OrangeHrmApi;
};

/**
 * Custom test fixtures that inject page objects and API clients into tests.
 * Each test receives fresh instances, bound to the current page and browser context.
 */
export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
  sidebar: async ({ page }, use) => {
    await use(new SidebarComponent(page));
  },
  topbar: async ({ page }, use) => {
    await use(new TopbarComponent(page));
  },
  toast: async ({ page }, use) => {
    await use(new ToastComponent(page));
  },
  addEmployeePage: async ({ page }, use) => {
    await use(new AddEmployeePage(page));
  },
  employeeListPage: async ({ page }, use) => {
    await use(new EmployeeListPage(page));
  },
  jobDetailsPage: async ({ page }, use) => {
    await use(new JobDetailsPage(page));
  },
  orangeHrmApi: async ({ context }, use) => {
    // context.request shares cookies with the browser, so API calls use the logged-in session.
    const client = new ApiClient(context.request, envConfig.baseUrl);
    await use(new OrangeHrmApi(client));
  },
});

export { expect };