# Dingel Hafizia Madrasa — Professional Management System

## Files
- `index.html` — complete dashboard UI
- `style.css` — responsive professional design
- `app.js` — Firebase + students + fee collection + reports + receipt
- `students.json` — optional starter/fallback data
- `firebase-rules.txt` — Firestore rules for the current setup

## Login
Password: `123`

## Firebase
The Firebase project configuration is already placed in `app.js`.

## GitHub Pages
Upload all files to the repository root. Keep these names exactly:
`index.html`, `style.css`, `app.js`, `students.json`.

## Important security note
The current UI uses a custom password, not Firebase Authentication. The included rules therefore allow Firestore access so the app can work with this setup. Before real production use, switch to Firebase Authentication and restrictive Firestore rules.
