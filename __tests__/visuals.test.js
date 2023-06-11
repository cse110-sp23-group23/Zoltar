/*
 * @jest-environment node
 */
/* eslint-disable import/no-extraneous-dependencies */
import percySnapshot from '@percy/puppeteer';
import puppeteer from 'puppeteer';

const EIGHT_BALL_URL = 'https://cse110-sp23-group23.github.io/cse110-sp23-group23/source/8ball/';
const URL_3D = 'http://localhost:5500/index.html';
const URL_2D = 'http://localhost:5500/index2d.html';

describe('visual testing thru percy.io', () => {
	let browser;
	let page;
	let splashScreen;
	const testData = {
		classBefore: '',
		classAfter: '',
		classList: '',

	};

	beforeEach(async () => {
		browser = await puppeteer.launch({
			executablePath: process.env.PUPPETEER_EXEC_PATH,
			headless: false,
			args: [
				'--no-sandbox',
			],
		});
		page = await browser.newPage();
		await page.setDefaultTimeout(0);
	});

	it('(3D) loads the homepage', async () => {
		await page.goto(URL_3D);
		await new Promise((r) => { setTimeout(r, 1000); });
		await percySnapshot(page, 'Loading 3D page image');
	});

	it('(2D) loads the homepage', async () => {
		await page.goto(URL_2D);
		await new Promise((r) => { setTimeout(r, 1000); });
		await percySnapshot(page, 'Loading 2D page image');
	});

	/**
	 * Checks if Eight Ball in 2D redirects to Magic-8-Ball page
	 * @param none
	 */
	async function testEightBall() {
		// wait for Eight Ball button to render
		const eightBallBtn = await page.waitForSelector('#eight-ball-image');
		await eightBallBtn.click();

		// wait for redirect to Magic 8 Ball to occur
		const newpage = () => document.querySelector('h1').innerText === 'The Mystic 8 Ball';
		await page.waitForFunction(newpage, 5000);

		// check if redirect works
		const newURL = await page.evaluate(() => window.location.href);
		expect(newURL).toBe(EIGHT_BALL_URL);
	}

	/**
	 * Checks if Splash Screen disappears after loadPagePastSplashScreen() is called
	 * @param { string } url 2d or 3d url
	 */
	async function testSplashScreen(url) {
		// checks splash screen class names after it is supposed to disappear
		testData.classList = await page.evaluate((el) => el.classList, splashScreen);
		testData.classAfter = Object.keys(testData.classList).length;
		await percySnapshot(page, `After splash is cleared at ${url}`);

		// check if correct class names are present
		expect(testData.classAfter).toBe(testData.classBefore + 2);
		expect(Object.values(testData.classList)).toContain('hidden');
		expect(Object.values(testData.classList)).toContain('no-opacity');
	}

	/**
	 * Loads the respective page, then clicks on the splash screen to make it disappear
	 * @param {*} url 2D or 3D url
	 */
	async function loadPagePastSplashScreen(url) {
		await page.goto(url);

		// Find splash screen and checks its class names
		splashScreen = await page.$('#splash-screen');
		testData.classList = await page.evaluate((el) => el.classList, splashScreen);
		testData.classBefore = Object.keys(testData.classList).length;

		// wait for assets of page to load
		await page.waitForSelector('.loaded-message');
		const fn = () => document.querySelector('.loaded-message').innerText.toLowerCase() !== 'loading...';
		await page.waitForFunction(fn, 60000);

		// clicks on splash screen
		await splashScreen.click();
		await new Promise((r) => { setTimeout(r, 2000); });
	}

	it('(3D) pressing anywhere on screen removes splash screen', async () => {
		await loadPagePastSplashScreen(URL_3D);
		await testSplashScreen(URL_3D);
	}, 0);

	it('(2D) pressing anywhere on screen removes splash screen', async () => {
		await loadPagePastSplashScreen(URL_2D);
		await testSplashScreen(URL_2D);
	}, 0);

	it('(2D) pressing on eight ball redirects to Magic 8 Ball', async () => {
		await loadPagePastSplashScreen(URL_2D);
		await testEightBall();
	}, 0);

	afterEach(async () => {
		await page.close();
		await browser.close();
	});
}, 180000);
