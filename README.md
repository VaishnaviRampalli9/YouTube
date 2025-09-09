## MockTube  

A simple demo application that replicates YouTube’s UI using Tailwind CSS. It showcases **lazy loading** and **infinite scrolling** with mock placeholder data.

### Features

- YouTube-inspired UI built with Tailwind CSS 
- Mock photo data for demonstration 
- Infinite scroll to load more items seamlessly 
- Lazy loading to optimize rendering performance 
- Firebase Hosting with automated preview and production deployments 

### Tech Stack

- [React 19](https://react.dev/) 
- [Vite 7](https://vitejs.dev/) for fast builds and dev server 
- [Tailwind CSS 4](https://tailwindcss.com/) for styling 
- [Axios](https://axios-http.com/) (future-ready for API requests, currently with mock data) 
- [ESLint 9](https://eslint.org/) with React-specific rules for code quality 
- [Firebase Hosting](https://firebase.google.com/docs/hosting) for deployment 

### Getting Started

##### Requirements
- Node.js 20+
- npm 10+
##### Clone the repository
```bash
git clone https://github.com/VaishnaviRampalli9/YouTube.git
cd mocktube  
```
##### Install dependencies
```bash
npm install
```
##### Run locally
```bash
npm run dev
```
App will be available at `http://localhost:5173` (or as shown in your terminal).

### Development

##### Linting
```bash
npm run lint
```
##### Production build
```bash
npm run build
```
##### Preview production build
```bash
npm run preview
```

### Project Structure

```
src/
 components/  # UI components
 util/    # Mock placeholder data and hooks
 App.jsx
```

### Deployment

The app is hosted on Firebase Hosting at:
1. https://mock-ae309.web.app/
2. https://mock-ae309.firebaseapp.com/
  
### Manual deploy

```bash
npm run build
firebase deploy
```

### CI/CD

Note: This project already includes Firebase configuration. If you are deploying from scratch, make sure to run `firebase init` and link to your Firebase project.

Firebase GitHub Actions workflows handle deployment:
* On **pull requests**, Firebase creates a preview deployment link.
* On **merge to main**, Firebase automatically updates the live site.
Example workflow (`.github/workflows/firebase-hosting.yml`):

```yaml
name: Deploy to Firebase Hosting on merge
on:
  push:
    branches:
      - main
jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci && npm run build
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: ${{ secrets.GITHUB_TOKEN }}
          firebaseServiceAccount: ${{ secrets.FIREBASE_SERVICE_ACCOUNT_MOCK_AE309 }}
          channelId: live
          projectId: mock-ae309
```

### Notes

* No backend integration, mock data only
* Built as a proof of concept for scrolling and loading techniques

### License
MIT