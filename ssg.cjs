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
	<body>
	  ${html}
	</body>
	</html>
  `;

  console.log(fullHtml);

  // fs.writeFileSync("dist/test.html", fullHtml, "utf-8");
}
getData();
