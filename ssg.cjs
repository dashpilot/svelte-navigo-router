require("svelte");
require("svelte/register");
const fs = require("fs");

const Page = require("./src/App.svelte").default;
async function renderPage() {
  const SSR = true;

  const res = await fetch(
    "https://api.eu-central-1.linodeobjects.com/navigo/data.json"
  );
  var data = await res.json();

  data.ssr = true;

  for (item of data.pages) {
    data.page = item.slug;
    data.isPage = true;
    data.isEntry = false;
    // console.log(data);

    const { html, css, head } = Page.render({
      data: data,
    });

    var fullHtml = `<!DOCTYPE html>
    <html>
    <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + Svelte</title>
    <!-- <script type="module" crossorigin src="/assets/index.js"></script> -->
    <link rel="stylesheet" href="/assets/index.css">
    </head>
    <body>
    <div id="app">
    
      ${html}
      
    </div>
    </body>
    </html>
    `;

    if (data.page == "home") {
      fs.writeFileSync("dist/index.html", fullHtml, "utf-8");
    } else {
      fs.mkdirSync("dist/" + data.page);
      fs.writeFileSync("dist/" + data.page + "/index.html", fullHtml, "utf-8");
    }
  }

  fs.mkdirSync("dist/article/");

  for (item of data.entries) {
    data.page = item.page;
    data.id = item.id;

    data.isPage = false;
    data.isEntry = true;
    // console.log(data);

    data.isPage = true;
    data.isEntry = false;

    const { html, css, head } = Page.render({
      data: data,
    });

    var slug = slugify(item.title, item.id);

    var fullHtml = `<!DOCTYPE html>
    <html>
    <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + Svelte</title>
    <!-- <script type="module" crossorigin src="/assets/index.js"></script> -->
    <link rel="stylesheet" href="/assets/index.css">
    </head>
    <body>
    <div id="app">
    
      ${html}
      
    </div>
    </body>
    </html>
    `;

    fs.mkdirSync("dist/article/" + slug);
    fs.writeFileSync("dist/article/" + slug + "/index.html", fullHtml, "utf-8");
  }
}

renderPage();

function slugify(str, id) {
  if (str.length < 3) {
    str = str + "-" + id;
  }

  str = str.replace(/^\s+|\s+$/g, ""); // trim
  str = str.toLowerCase();

  // remove accents, swap ñ for n, etc
  var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
  var to = "aaaaeeeeiiiioooouuuunc------";
  for (var i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
  }

  str = str
    .replace(/[^a-z0-9 -]/g, "") // remove invalid chars
    .replace(/\s+/g, "-") // collapse whitespace and replace by -
    .replace(/-+/g, "-"); // collapse dashes

  return str;
}
