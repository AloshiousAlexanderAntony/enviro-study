# Enviro Study App

Files in this folder:
- index.html: app shell with Notes and Tracker tabs
- board.html: your study board
- gate.html: GATE 2027 syllabus map, materials and study plan
- tracker.html: YOUR Hunter Log file (you must add it, see step 1)
- tracker-syllabus-2027.js: updated syllabus for your tracker (optional, see step 1b)
- manifest.webmanifest, sw.js, : make it installable and offline-ready

## Step 1: add the tracker
Save the Hunter Log code you pasted as `tracker.html` in this folder, next to index.html.

## Step 1b: update the tracker syllabus (recommended)
GATE 2027 uses a revised 9-section syllabus. Open tracker-syllabus-2027.js and replace the SYLLABUS and WEAK_SUBJECTS lines in tracker.html with its contents. The sudden-quest question labels keep the old subject names until you edit QUESTION_BANK.

## Step 2: test on your computer
In this folder run `python3 -m http.server 8000` and open http://localhost:8000 in Chrome.
(Opening index.html by double-click will not register the service worker.)

## Step 3: put it online (GitHub Pages)
1. Create a free GitHub account and a new public repository named `enviro-study`.
2. Upload every file and the icons folder (Add file, Upload files).
3. Settings, Pages, Source: "Deploy from a branch", Branch: main, folder: / (root), Save.
4. After a minute your app is live at https://YOUR-USERNAME.github.io/enviro-study/

## Step 4: install on Android
Open that link in Chrome, tap the three-dot menu, choose "Install app" (or "Add to Home screen"). It now opens full screen with its own icon and works offline after the first load.

## Updating later
Edit the file on GitHub, then change `enviro-study-v2` to `v2` in sw.js so phones fetch the new version.

## Sync across devices (Firebase)
1. Create a free Firebase project, add a Web app, and copy its config into firebase-config.js.
2. Enable Authentication, Email/Password.
3. Create a Firestore database and paste firestore.rules into its Rules tab, then Publish.
4. Upload the changed files to GitHub. Tap Sync in the app, create an account, sign in on each device.
Sync is last-write-wins: the most recently changed device overwrites older data. Sign in first on the device that holds your main progress.
