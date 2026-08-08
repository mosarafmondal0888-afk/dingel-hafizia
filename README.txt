DINGEL HAFIZIA MADRASA — FINAL PROFESSIONAL PACKAGE

Files:
- index.html          Main responsive application
- style.css           Premium responsive UI
- app.js              Firebase, students, fees, reports, CSV and receipts
- logo.svg             Custom madrasa logo
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
logo.svg
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
