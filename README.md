# OrangeHRM Employee Lifecycle Automation

End-to-end UI and API automation for the OrangeHRM demo site, built with Playwright Test, TypeScript, and the Page Object Model (POM).

**Scenario covered:** Login → Add Employee (data-driven, with photo) → Search and Edit Job Details → API validation with UI cross-check → Delete (UI and API verification) → Logout and session invalidation.

## Prerequisites

- Node.js 18 or later (20 LTS recommended)
- npm 9 or later
- Git

## Setup

```
bash
# 1. Clone the repository
git clone <REPOSITORY_URL>
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
│   └── e2e/employee-lifecycle.spec.ts # End-to-end scenario
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

# Type-check the project
npm run typecheck

# Open the HTML report after a run
npm run report
```

## Test Artifacts

| Artifact | Location |
|---|---|
| HTML report | `reports/html/index.html` (open with `npm run report`) |
| Test run video | `test-results/` (also embedded in the HTML report) |
| Traces (on failure) | `test-results/` (view with `npx playwright show-trace <file>`) |
| Failure screenshots | `test-results/` |

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

## Reviewers

- Reviewer 1: `<REVIEWER_ID_1>`
- Reviewer 2: `<REVIEWER_ID_2>`
```
`