// Runs tests/index.html in headless Chromium and exits non-zero on failures.
// Set BROWSER_CHANNEL (e.g. "chrome" or "msedge") to use an installed browser
// instead of the one from `npx playwright install chromium`.
const fs = require('fs');
const http = require('http');
const path = require('path');
const { chromium } = require('playwright');

const root = path.join(__dirname, '..');
const types = {
	'.css': 'text/css',
	'.html': 'text/html',
	'.js': 'text/javascript'
};

// The page loads chai as an ES module, which browsers refuse over file://.
const server = http.createServer((req, res) => {
	const file = path.join(root, decodeURIComponent(new URL(req.url, 'http://localhost').pathname));
	if (!file.startsWith(root)) {
		res.writeHead(403).end();
		return;
	}
	fs.readFile(file, (err, data) => {
		if (err) {
			res.writeHead(404).end();
			return;
		}
		res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' }).end(data);
	});
});

async function run(port) {
	const browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL });
	try {
		const page = await browser.newPage();
		const errors = [];
		page.on('pageerror', (err) => errors.push(err.message));

		await page.goto('http://localhost:' + port + '/tests/index.html');
		await page.waitForFunction(() => window.mochaResults, null, { timeout: 60000 });
		const results = await page.evaluate(() => window.mochaResults);

		results.failures.forEach((failure) => console.error('FAIL ' + failure));
		errors.forEach((error) => console.error('PAGE ERROR ' + error));
		console.log(results.stats.passes + ' passing, ' + results.stats.failures + ' failing');

		return results.stats.failures === 0 && errors.length === 0;
	} finally {
		await browser.close();
	}
}

server.listen(0, async() => {
	let ok = false;
	try {
		ok = await run(server.address().port);
	} catch (err) {
		console.error(err);
	}
	server.close();
	process.exit(Number(!ok));
});
