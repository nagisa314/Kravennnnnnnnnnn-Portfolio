import fs from "fs";
import path from "path";

const manifestPath = path.resolve("public/build/manifest.json");

if (!fs.existsSync(manifestPath)) {
  console.error("Run `npm run build` first.");
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const cssFile = manifest["resources/css/app.css"]?.file;
const jsFile  = manifest["resources/js/app.jsx"]?.file;

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Portfolio</title>

  <link rel="stylesheet" href="./build/${cssFile}">
</head>
<body>
  <div id="app"></div>
  <script type="module" src="./build/${jsFile}"></script>
</body>
</html>
`;

fs.writeFileSync("public/index.html", html);
fs.writeFileSync("public/404.html", html);

console.log("✅ Static HTML created");
