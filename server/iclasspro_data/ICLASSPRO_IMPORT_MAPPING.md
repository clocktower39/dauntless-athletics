# iClassPro Student CSV Mapping

Observed source file:
- `server/iclasspro_data/Custom_Student_List_03-16-2026.csv`

Row shape:
- One row per student.
- In this system, `student` maps to `athlete`.
- Family/guardian data is repeated across student rows.

Important quirks:
- The first header cell is blank. It appears to contain a source row/student id.
- Several headers are duplicated exactly:
  - `Secondary Guardian Name`
  - `Secondary Phone Number`
  - `Secondary Email`
- The aggregate guardian fields such as `Secondary Guardian Names`, `Secondary Phone Numbers`, and `Secondary Emails` are more reliable than the duplicated single-value headers.
- A large number of empty values are represented as `--`.

Planned target mapping:

`families`
- `name`: derived during import, likely from `Primary Guardian Name` or household last name
- `primary_guardian_name`: `Primary Guardian Name`
- `primary_email`: `Primary Email`
- `primary_phone`: `Primary Phone Number`
- `street_1`: `Street 1`
- `street_2`: `Street 2`
- `city`: `City`
- `state`: `State`
- `postal_code`: `Zip`
- `balance_due`: `Balance Due`
- `last_payment_date`: `Last Payment Date`
- `last_payment_amount`: `Last Payment Amount`
- `source_system`: `iclasspro`
- `source_record_id`: derived household key during import

`parents`
- one primary guardian from:
  - `Primary Guardian Name`
  - `Primary Email`
  - `Primary Phone Number`
- optional additional guardians from:
  - `Secondary Guardian Names`
  - `Secondary Emails`
  - `Secondary Phone Numbers`
- `family_id`: resolved during import

`athletes`
- `first_name` / `last_name`: parsed from `Student Name`
- `dob`: `Birthday`
- `gender`: `Gender`
- `family_id`: resolved during import
- `external_source`: `iclasspro`
- `external_source_id`: blank first column value
- `source_created_at`: `Created Date`

`athlete_profiles`
- `primary_email`: `Primary Email`
- `age_label`: `Age`
- `student_keywords`: `Student Keywords`
- `roll_sheet_comment`: `Roll Sheet Comment`
- `allergies_health_concerns`: `Allergies Health Concerns`
- `hospital_clinic_preference`: `Hospital Clinic Preference`
- `insurance_carrier_company`: `Insurance Carrier Company`
- `policy_number`: `Policy Number`
- `physician_name`: `Physician Name`
- `physician_phone`: `Physician Phone`
- `emergency_contact_name` / `emergency_contact_phone`: parsed from `Emergency Contact (Custom Field)`
- `active_enrollment_count`: `Active Enrollment Count`
- `class_enrollment_count`: `Class Enrollment Count`
- `camp_enrollment_count`: `Camp Enrollment Count`
- `appointment_booking_count`: `Appointment Booking Count`
- `current_event_name`: `Event Name`
- `instructors`: `Instructors`

Not importing yet:
- team assignment from `Event Name`
- coach assignment from `Instructors`
- financial automation beyond the latest balance/payment snapshot

Import strategy later:
1. Normalize `--` to null.
2. Parse student name into first/last name.
3. Build a deterministic family key from primary guardian + address.
4. Upsert `families`.
5. Upsert primary and secondary guardians into `parents`.
6. Upsert `athletes`.
7. Upsert `athlete_profiles`.
8. Link guardians to athletes through `parent_athlete`.
