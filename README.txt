DINGEL HAFIZIA MADRASA — FINAL PROFESSIONAL PACKAGE

Files:
- index.html          Main responsive application
- style.css           Premium responsive UI
- app.js              Firebase, students, fees, reports, CSV and receipts
- logo.png             Custom madrasa logo
- students.json       Empty starter/fallback data (no demo student)
- firebase-rules.txt  Firestore rules for the current custom-password setup
- README.txt          Setup notes

Login password:
123

Firebase:
The existing Dingel Hafizia Firebase project configuration is already in app.js.

GitHub Pages:
Upload every file to the repository ROOT. Do not rename:
index.html
style.css
app.js
logo.png
students.json

Important:
The custom password is a front-end login, not Firebase Authentication. The included Firestore rules are intentionally permissive so the current setup can work. For a real production deployment, use Firebase Authentication and restrictive rules.


PHONE / NAVIGATION:
- Responsive mobile sidebar with overlay.
- Touch-friendly buttons.
- PWA manifest and service worker included.
- After GitHub Pages publishes, the site can be added to the phone home screen from the browser.

IMPORTANT FIREBASE SECURITY:
This version keeps the existing custom password login so it works immediately with GitHub Pages.
The Firestore rules are permissive for compatibility. For a genuinely secure production system,
enable Firebase Authentication and replace the rules with authenticated-user rules. Do not use
the current rules for sensitive real-world data without that upgrade.


REAL MADRASA LOGO:
The uploaded original madrasa logo is included as logo.png and is used throughout the app.


ADMISSION FORM:
- Classes/options: HIFZ, MOKTOB, ADNA ALIF, ADNA BA
- Student type: General, Orphan, Poor
- Student photo, guardian photo and document selection with preview
- Student/guardian Aadhaar fields
- Father, mother, phone, DOB, admission date, address, monthly fee, notes
- Student Details view
- Madrasa profile section using the uploaded original logo

IMPORTANT:
The browser form previews selected files but this version does not silently claim to upload documents to Firebase Storage.
If you want permanent photo/document storage, Firebase Storage upload plus strict authenticated Storage Rules should be enabled before using real Aadhaar/document data.


FULL MANAGEMENT MODULES:
- Dashboard: total students, total fee collection, current-month fee, free students, total due, total income, total expense, balance.
- Admissions: HIFZ, MOKTOB, ADNA ALIF, ADNA BA; General/Orphan/Poor; student/guardian details, Aadhaar fields and document/photo preview.
- Student Management: search, details, edit, delete, CSV export.
- Fee Management: monthly collection, receipt, history, auto receipt number.
- Due Management: current-month due per student and total due.
- Accounts: fee income + other income - expenses; monthly accounting and balance.
- Expenses: food, salary, electricity/gas, water, medical, education supplies, rent, repair, transport, other.
- Other Income: donation, grant, admission fee, other.
- Reports: complete student, fee, due, income, expense and monthly financial report.
- Madrasa Profile: original uploaded madrasa logo and profile.

IMPORTANT SECURITY:
The current custom-password login and Firestore rules are for compatibility/testing. For real production use with Aadhaar, photos and documents, enable Firebase Authentication and restrictive Firestore/Storage Rules before storing sensitive records.
