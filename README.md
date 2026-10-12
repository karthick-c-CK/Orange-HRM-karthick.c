# OrangeHRM Employee Lifecycle Automation

End-to-end UI and API automation for the OrangeHRM demo site, built with Playwright Test, TypeScript, and the Page Object Model (POM).

**Scenario covered:** Login → Add Employee (data-driven, with photo) → Search and Edit Job Details → API validation with UI cross-check → Delete (UI and API verification) → Logout and session invalidation.

## Prerequisites

- Node.js 18 or later (20 LTS recommended)
- npm 9 or later
- Git
- Apache JMeter 5.6.3 or later (only needed to run the concurrent-load plan)

## Setup

```
bash
# 1. Clone the repository
git clone https://github.com/karthick-c-CK/Orange-HRM-karthick.c.git
cd orangehrm-playwright-pom

# 2. Install dependencies
npm ci

# 3. Install the Chromium browser
npm run install:browsers

# 4. Create the environment file
cp .env.example .env        # Windows: copy .env.example .env

# 5. The profile picture used by the data-driven test is included at:
#    test-data/assets/profile-picture.png
```

## Framework Structure

```
.
├── .github/workflows/playwright.yml   # CI pipeline (GitHub Actions)
├── src/
│   ├── api/                           # API client and OrangeHRM endpoint wrappers
│   ├── data/                          # Data loader (JSON) and Employee ID factory
│   ├── fixtures/                      # Custom Playwright fixtures (page objects, API)
│   ├── pages/                         # Page objects (POM)
│   │   ├── components/                # Reusable UI components (sidebar, topbar, toast)
│   │   └── pim/                       # PIM module pages
│   ├── types/                         # TypeScript interfaces
│   └── utils/                         # Env config, constants, logger
├── tests/
│   ├── e2e/employee-lifecycle.spec.ts # End-to-end scenario
│   └── performance/
│       ├── employee-lifecycle-performance.spec.ts # Single-user browser timing
│       └── orangehrm-authenticated-read-load.jmx # Concurrent HTTP load baseline
├── test-data/
│   ├── employees.json                 # Data-driven employee input
│   └── assets/profile-picture.png     # Profile image used by test
├── playwright.config.ts               # Runner, reporter, video, and browser settings
├── tsconfig.json
├── package.json
├── .env.example
└── README.md
```

**Design notes:**
- Page objects contain UI interactions and locators. Assertions are kept in tests or in clearly named `expect*` methods, and every assertion includes a descriptive message.
- API calls go through `ApiClient`, which reuses the browser session cookie. This lets API checks run after UI actions without a separate login.
- Each run generates a unique Employee ID, so repeated runs do not collide on the shared demo data.

## How to Run the Tests

```
bash
# Run the full suite (headless)
npm test

# Run with the visible browser
npm run test:headed

# Run in Playwright debug mode
npm run test:debug

# Run the full employee lifecycle performance measurement
npm run test:performance

# Type-check the project
npm run typecheck

# Open the HTML report after a run
npm run report
```

The performance test reports elapsed time for each employee lifecycle phase and attaches a JSON summary to the Playwright report. These measurements include browser interactions, application response time, and test assertions; they are useful as a single-user baseline, not as concurrent-user load testing.

## JMeter Concurrent Load Baseline

The JMeter plan runs five virtual users with a 10-second ramp-up and a 60-second thread-group duration. Each virtual user logs in once, then repeatedly requests the dashboard, PIM employee-list page, and employees API with one-second pacing between requests. It is an authenticated, read-only HTTP load baseline; it does not run a browser, upload a profile picture, or create/edit/delete employees.

Install Apache JMeter 5.6.3 or later and ensure `jmeter` is on `PATH`. Set credentials in the current PowerShell session (do not put them in the `.jmx` file):

```powershell
$env:ORANGEHRM_USERNAME = "your-authorized-test-username"
$env:ORANGEHRM_PASSWORD = "your-authorized-test-password"
```

Run the test only against an environment you are authorized to load-test. The plan defaults to `http://localhost:8080`; the public OrangeHRM demo requires the explicit target options below and should only be used with authorization:

```powershell
jmeter -n -t tests/performance/orangehrm-authenticated-read-load.jmx `
  "-Jhost=opensource-demo.orangehrmlive.com" "-Jprotocol=https" "-Jport=443" `
  "-Jorigin=https://opensource-demo.orangehrmlive.com" `
  "-Jreferer=https://opensource-demo.orangehrmlive.com/web/index.php/auth/login" `
  -l reports/jmeter-load.jtl -e -o reports/jmeter-load-html
```

Open `reports/jmeter-load-html/index.html` to review the generated aggregate report. Remove/archive the prior JMeter result file and HTML report directory before rerunning if JMeter reports that the output already exists. Do not commit credentials or result artifacts containing environment details.

The plan asserts that each virtual user reaches the dashboard after login and receives authenticated JSON from the employees API. If login redirects back to the login page or the API returns `401`, treat the run as failed rather than using its timings as authenticated application performance results. The shared public demo may reject concurrent or non-browser sessions; use a test/staging instance with authorized load-test credentials for a reliable authenticated baseline.

## Test Artifacts

| Artifact | Location |
|---|---|
| HTML report | `reports/html/index.html` (open with `npm run report`) |
| Test run video | `test-results/` (also embedded in the HTML report) |
| Traces (on failure) | `test-results/` (view with `npx playwright show-trace <file>`) |
| Failure screenshots | `test-results/` |
| Submission copy of the Playwright HTML report | `submission-artifacts/playwright-report/index.html` |
| Submission copy of the test video | `submission-artifacts/test-run-video.webm` |

## Configuration

| Variable | Purpose | Default |
|---|---|---|
| `BASE_URL` | Target OrangeHRM instance | `https://opensource-demo.orangehrmlive.com` |
| `ORANGEHRM_USERNAME` | Login username | `Admin` |
| `ORANGEHRM_PASSWORD` | Login password | `admin123` |

Do not commit `.env`. For CI, store the credentials as GitHub repository secrets.

## Adding Test Data

Add an object to `test-data/employees.json`. Each object becomes a separate test:

```
json
{
"firstName": "First",
"lastName": "Last",
"employeeIdPrefix": "AB",
"profilePicture": "assets/profile-picture.png",
"jobDetails": {
  "jobTitle": "QA Engineer",
  "employmentStatus": "Full-Time Contract"
}
}
```

`employeeIdPrefix` must be 1 to 5 alphanumeric characters. Job titles and employment statuses must exist in the target OrangeHRM instance.

## Dependencies

| Package | Purpose |
|---|---|
| `@playwright/test` | Test runner, browser automation, HTML report, video recording |
| `typescript` | Static typing |
| `@types/node` | Node.js type definitions |
| `dotenv` | Loads environment variables from `.env` |

## Submission

- Candidate: Karthick C
- GitHub account: [karthick-c-CK](https://github.com/karthick-c-CK)
- Submission archive filename: `Karthick_C_OrangeHRM_Automation.zip`
- Reviewer GitHub IDs were not included in the assessment brief provided. Add the reviewers as repository collaborators once their usernames are available.