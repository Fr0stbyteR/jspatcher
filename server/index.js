const express = require("express");

const app = express();
const port = 18000;

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Cross-Origin-Embedder-Policy', 'require-corp');
	res.header('Cross-Origin-Opener-Policy', 'same-origin');
	res.header('Cross-Origin-Resource-Policy', 'cross-origin');
	next();
});

app.use(express.static("./dist"))

app.listen(port);

console.info(`Host server started on http://localhost:${port}`);
