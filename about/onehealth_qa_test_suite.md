# One Health — Software QA Test Documentation Suite
**System Under Test**: One Health (Barangay Immunization Record & Appointment Management System)  
**Author / QA Lead**: Kraven Cris Añonuevo  
**Methodology**: Agile / ISTQB Certified Tester Standards  
**Target Environment**: Production (`onehealth.my`) / Staging  
**Document Version**: 1.0 (August 2026)

---

# 📑 PART 1: TEST PLAN (IEEE 829 / ISTQB Standard)

## 1. Introduction & Objectives
The primary objective of this testing campaign is to verify that the **One Health** web platform accurately tracks pediatric immunization records, manages health worker authentication, validates patient eligibility using clinical age rules, and provides automated appointment tracking without data corruption or security vulnerabilities.

## 2. Scope of Testing

### In-Scope:
*   **Authentication & Authorization**: Health Worker Login, Session Management, Role-Based Access Control (Admin vs. Field Health Worker).
*   **Patient Registry & Demographics**: Newborn/Infant enrollment, guardian contacts, barangay assignment, and field validations.
*   **Immunization Schedules & Dosage Tracking**: Vaccine catalog (BCG, Hepatitis B, Pentavalent, OPV, IPV, Measles), dose intervals, catch-up scheduling.
*   **Public Patient Search**: Parent/Guardian record verification via non-password demographic lookup.
*   **Reporting & Analytics**: Monthly TAVR (Target Client List), Missed Schedule summaries, PDF/Excel data export.
*   **Security & Input Sanitization**: Cross-Site Scripting (XSS), SQL Injection (SQLi), and basic data masking.

### Out-of-Scope:
*   Hardware-level server load testing beyond 500 concurrent users.
*   Third-party SMS gateway carrier latency testing.

## 3. Testing Types Applied
1.  **Smoke / Sanity Testing**: Verifying critical build stability before executing regression suites.
2.  **Functional Testing**: Validating business rules and database CRUD operations.
3.  **Boundary Value Analysis (BVA) & Equivalence Partitioning (EP)**: Testing age thresholds and date ranges.
4.  **Negative & Error Guessing**: Testing malformed inputs, duplicate entries, and boundary overflows.
5.  **Security Testing**: SQL Injection vulnerability scans on public search forms.
6.  **User Acceptance Testing (UAT)**: Simulated workflows with Barangay Health Center personnel.

## 4. Entry & Exit Criteria
*   **Entry Criteria**: 
    *   Staging environment deployed and database seeded with test records.
    *   Approved User Stories and Acceptance Criteria available.
*   **Exit Criteria**:
    *   100% of P1 (Critical) and P2 (High) test cases executed with a 95%+ pass rate.
    *   Zero open Critical or High severity bugs.
    *   All identified defects documented in the defect tracker.

---

# 📋 PART 2: COMPREHENSIVE TEST CASES

| Test ID | Module | Test Title / Objective | Type | Priority | Preconditions | Test Steps | Test Data | Expected Result | Status |
| :--- | :--- | :--- | :--- | :---: | :--- | :--- | :--- | :--- | :---: |
| **TC_OH_AUTH_001** | Authentication | Verify successful login with valid health worker credentials | Positive / Functional | High (P1) | 1. Account exists in database.<br>2. On `/login` page. | 1. Enter valid username.<br>2. Enter valid password.<br>3. Click "Login". | User: `staff_silang01`<br>Pass: `ValidP@ss2026!` | User is authenticated and redirected to the Health Worker Dashboard. Welcome banner displays staff name. | `PASS` |
| **TC_OH_AUTH_002** | Authentication | Verify login failure with invalid password | Negative / Security | High (P1) | Account exists. On `/login` page. | 1. Enter valid username.<br>2. Enter incorrect password.<br>3. Click "Login". | User: `staff_silang01`<br>Pass: `WrongPass123` | System denies access. Red error toast displays: *"Invalid credentials. Please check your username and password."* | `PASS` |
| **TC_OH_AUTH_003** | Authentication | Verify account lockout after 5 consecutive failed login attempts | Security | Medium (P2) | Account exists and is active. | 1. Enter valid username with wrong password 5 times in a row. | User: `staff_silang01`<br>Pass: `BadPass#1` ... `BadPass#5` | Account status updates to "Temporarily Locked" for 15 minutes. Warning message displays with cooldown timer. | `PASS` |
| **TC_OH_REG_001** | Patient Registry | Verify infant registration with valid mandatory fields | Positive / Functional | High (P1) | Logged in as Health Worker on `/patients/add`. | 1. Enter First, Middle, Last Name.<br>2. Select Birthdate (6 months ago).<br>3. Select Gender & Barangay.<br>4. Enter Guardian contact.<br>5. Click "Save Patient". | Name: `Baby James Cruz`<br>DOB: `02/15/2026`<br>Brgy: `Biga 1`<br>Phone: `09153091040` | Patient record is created in MySQL with a unique `Patient_ID`. Success confirmation modal appears. | `PASS` |
| **TC_OH_REG_002** | Patient Registry | Verify BVA validation on infant age in months: `Min - 1` (-1 month) | BVA / Negative | High (P1) | On patient registration form. | 1. Set Birthdate to a future date (e.g., tomorrow).<br>2. Click "Save Patient". | DOB: Tomorrow's date (`Age: -1 day`) | Form validation triggers. Error appears below date field: *"Birthdate cannot be a future date."* | `PASS` |
| **TC_OH_REG_003** | Patient Registry | Verify BVA validation on infant age: `Min` (0 days / Newborn) | BVA / Positive | High (P1) | On patient registration form. | 1. Set Birthdate to today's date.<br>2. Fill required fields.<br>3. Click "Save Patient". | DOB: Today's date (`Age: 0 days`) | Record is accepted and saved. Initial Newborn vaccines (BCG, Hep B Birth Dose) are queued. | `PASS` |
| **TC_OH_REG_004** | Patient Registry | Verify BVA validation on primary infant schedule: `Max` (24 months) | BVA / Positive | High (P1) | On patient registration form. | 1. Set Birthdate to exactly 24 months ago.<br>2. Click "Save Patient". | DOB: Exactly 2 years prior | Record is saved successfully with full historical immunization table enabled. | `PASS` |
| **TC_OH_REG_005** | Patient Registry | Verify BVA validation on primary infant schedule: `Max + 1` (25 months) | BVA / Functional | Medium (P2) | On patient registration form. | 1. Set Birthdate to 25 months ago.<br>2. Click "Save Patient". | DOB: 25 months prior | Record is saved, but system displays notification: *"Child exceeds standard infant schedule; flagged for catch-up protocol."* | `PASS` |
| **TC_OH_VAX_001** | Dosage Tracking | Verify logging of BCG single dose with lot number and staff signature | Positive / Functional | High (P1) | Patient registered, on patient record page. | 1. Click "Administer BCG".<br>2. Enter Vaccine Lot Number.<br>3. Select Administration Date.<br>4. Click "Confirm Dose". | Vaccine: `BCG`<br>Lot: `BCG-2026-X9`<br>Date: Today | Dose status changes from "Pending" to "Administered". Dose is locked against accidental deletion. | `PASS` |
| **TC_OH_VAX_002** | Dosage Tracking | Verify dose interval enforcement for Pentavalent (Minimum 28-day gap) | Business Logic / Negative | High (P1) | Patient received Pentavalent Dose 1 on Day 0. | 1. Attempt to log Pentavalent Dose 2 on Day 10 (10 days later).<br>2. Click "Confirm Dose". | Interval: `10 days` (Requires >= 28 days) | System blocks entry with warning: *"Minimum interval violation: Pentavalent Dose 2 requires at least 4 weeks after Dose 1."* | `PASS` |
| **TC_OH_SRCH_001** | Public Search | Verify parent can access immunization records with matching details | Positive / Functional | High (P1) | On public portal `/patient-search`. | 1. Enter registered Full Name.<br>2. Select matching DOB.<br>3. Select matching Barangay.<br>4. Click "Access My Records". | Name: `Baby James Cruz`<br>DOB: `02/15/2026`<br>Brgy: `Biga 1` | System loads the read-only Patient Immunization Dashboard. Contact numbers of guardian are masked (`0915****040`). | `PASS` |
| **TC_OH_SRCH_002** | Public Search | Verify error prompt when searching for non-existent record | Negative / Functional | High (P1) | On public portal `/patient-search`. | 1. Enter unregistered random name.<br>2. Select random DOB.<br>3. Click "Access My Records". | Name: `Unknown Person 999`<br>DOB: `01/01/2020`<br>Brgy: `Poblacion` | System remains on search page. Toast alert: *"No immunization records found. Please verify details or visit your Barangay Health Center."* | `PASS` |
| **TC_OH_SEC_001** | Security / SQLi | Verify SQL Injection resilience on patient search input fields | Security / Negative | High (P1) | On public portal `/patient-search`. | 1. Enter SQL injection payload in Name field: `' OR '1'='1' --`<br>2. Click "Access My Records". | Payload: `' OR '1'='1' --` | Input is sanitized. System does NOT return all database records or throw SQL syntax errors; shows standard "No records found". | `PASS` |
| **TC_OH_SCHED_001** | Appointment Life Cycle | Verify appointment status automatically updates to "Missed" when date passes | State Transition | Medium (P2) | Patient had an appointment scheduled for yesterday. | 1. Open Missed Schedules dashboard as Health Worker. | Target Date: Yesterday (`Unchecked dose`) | Patient appointment state transitions from `Scheduled` ➔ `Missed`. SMS reminder trigger is queued. | `PASS` |
| **TC_OH_REP_001** | Reporting | Verify monthly immunization report export to Excel (.xlsx) format | Functional / Export | Medium (P2) | Logged in as Admin on Reports page. | 1. Select Month: "August 2026".<br>2. Select Barangay: "All".<br>3. Click "Export to Excel". | Month: `August 2026` | Browser initiates download of `OneHealth_TAVR_August2026.xlsx`. File opens with correct patient totals and formatting. | `PASS` |

---

# 🐞 PART 3: SAMPLE DEFECT (BUG) REPORTS

### Defect Report 1: High Severity SQL Error on Special Characters
```markdown
Issue Type: 🐞 Defect
Key / ID: OH-BUG-042
Summary: [Patient Search] Unhandled SQL syntax exception when searching names with apostrophes/single quotes

Severity: S2 (High)
Priority: P1 (High)
Component: Public Patient Portal / Search API
Found in Build: v1.0.4-prod
Reporter: Kraven Cris Añonuevo (QA Lead)

Description:
When a parent enters a surname containing an apostrophe (e.g., "O'Connor", "D'Angelo") in the Full Name search box, the backend fails to parameterize the query, triggering a raw MySQL error that exposes server paths.

Steps to Reproduce:
1. Open 'https://onehealth.my/patient-search'.
2. In the "Full Name" input box, type: "Maria D'Angelo".
3. Select Birthdate "05/12/2024" and select Barangay "Lucsuhin".
4. Click the "Access My Records" button.

Expected Result:
Input should be safely escaped. The system should display the matching record or show a clean "Record not found" notification.

Actual Result:
Server responds with HTTP 500. A raw framework debug error is displayed:
"SQLSTATE[42000]: Syntax error or access violation: 1064 You have an error in your SQL syntax near 'Angelo'..."

Suggested Fix:
Use PDO prepared statements or Laravel Eloquent bindings ($query->where('name', $name)) to sanitize string inputs.
```

---

# 🔗 PART 4: REQUIREMENT TRACEABILITY MATRIX (RTM)

The RTM ensures **100% test coverage** by mapping every business requirement directly to its corresponding Test Case IDs.

| Requirement ID | Business Requirement Description | Test Case ID(s) | Test Execution Status |
| :--- | :--- | :--- | :---: |
| **REQ-AUTH-01** | Secure multi-role authentication with session protection | `TC_OH_AUTH_001`, `TC_OH_AUTH_002`, `TC_OH_AUTH_003` | **100% PASS** |
| **REQ-REG-01** | Complete demographic recording for infants and guardians | `TC_OH_REG_001`, `TC_OH_REG_003` | **100% PASS** |
| **REQ-REG-02** | Boundary validation on pediatric age groups (0 to 24 months) | `TC_OH_REG_002`, `TC_OH_REG_004`, `TC_OH_REG_005` | **100% PASS** |
| **REQ-VAX-01** | Dosage administration tracking with lot number verification | `TC_OH_VAX_001` | **100% PASS** |
| **REQ-VAX-02** | Clinical minimum dosage interval enforcement | `TC_OH_VAX_002` | **100% PASS** |
| **REQ-SRCH-01** | Public parent access with demographic verification | `TC_OH_SRCH_001`, `TC_OH_SRCH_002` | **100% PASS** |
| **REQ-SEC-01** | Data sanitization against SQL injection and XSS | `TC_OH_SEC_001` | **100% PASS** |
| **REQ-SCHED-01**| Automated lifecycle transitions for missed appointments | `TC_OH_SCHED_001` | **100% PASS** |
| **REQ-REP-01** | Exportable monthly Target Client List in Excel/PDF | `TC_OH_REP_001` | **100% PASS** |
