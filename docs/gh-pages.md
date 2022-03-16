# Year Three Notes

Staging deployment automated through GHA. See `.github/workflows/frontend.yml`

# Year Two Notes

```
cd /front-end
npm install
npm i angular-cli-ghpages --save
ng add angular-cli-ghpages
npm i @babel/compat-data@7.8.0
npm audit fix
ionic build --prod -- --base-href https://CU-CRD-app.github.io/psych-capstone
npx angular-cli-ghpages --dir=www --no-silent
```

find 404.html and index.html, add <base href="https://CU-CRD-app.github.io/psych-capstone/">

add .nojekyll file