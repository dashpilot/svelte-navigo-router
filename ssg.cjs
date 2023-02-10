require("svelte");
require("svelte/register");
const fs = require("fs");

const Page = require("./src/App.svelte").default;
async function getData() {
  const SSR = true;

  const res = await fetch(
    "https://api.eu-central-1.linodeobjects.com/test/data.json"
  );
  var data = await res.json();

  data.ssr = true;
  data.page = "about";
  // console.log(data);

  const { html, css, head } = Page.render({
    data: data,
  });

  const fullHtml = `<!DOCTYPE html>
	<html>
  <head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/svg+xml" href="/vite.svg" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Vite + Svelte</title>
  <script type="module" crossorigin src="/assets/index.js"></script>
  <link rel="stylesheet" href="/assets/index.css">
  </head>
	<body>
	  ${html}
    
   
	</body>
	</html>
  `;

  // console.log(fullHtml);

  fs.mkdirSync("dist/about");
  fs.writeFileSync("dist/about/index.html", fullHtml, "utf-8");
}
getData();
