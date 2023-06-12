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
	let zoltar;
	let mainTicket;
	let closeBtn;
	let saveBtn;
	let discardBtn;
	let countTicketBtn;
	const testData = {
		classBefore: '',
		classAfter: '',
		classList: '',
	};

	const SAVE = 1;
	const DISCARD = 0;

	beforeEach(async () => {
		browser = await puppeteer.launch({
			headless: false,
			args: [],
		});
		page = await browser.newPage();
		await page.setDefaultTimeout(0);
	});

	/**
	 * Page Load test with percySnapshot
	 * @param { string } url 3D or 2D URL
	 * @param { string} version '3D' or '2D' for percy image caption
	 */
	async function loadTest(url, version) {
		await page.goto(url);
		await new Promise((r) => { setTimeout(r, 1000); });
		await percySnapshot(page, `Loading ${version} page image`);
	} /* loadTest */

	it('(3D) loads the homepage', async () => {
		await loadTest(URL_3D, '3D');
	});

	it('(2D) loads the homepage', async () => {
		await loadTest(URL_2D, '2D');
	});

	async function getClassList(tag) {
		const arr = await page.waitForSelector(tag);
		const result = await page.evaluate((el) => el.classList, arr);
		return result;
	}

	async function checkTicketCount(int) {
		const ticketCount = await page.$('#ticket-count');
		const innerText = await ticketCount.getProperty('innerText');
		const value = await innerText.jsonValue();

		expect(Number(value)).toBe(int);
	}

	async function generateMainTicket() {
		zoltar = await page.waitForSelector('#eight-ball-container');
		await checkTicketCount(0);

		await zoltar.click();
		testData.classList = await getClassList('.ticket-wrapper');
		const updatesClass = () => document.querySelector('.ticket-wrapper').classList.contains('ticket-hoverable');

		await page.waitForFunction(updatesClass, 5000);
		testData.classList = await getClassList('.ticket-wrapper');
		mainTicket = await page.waitForSelector('.ticket-wrapper');

		expect(Object.values(testData.classList)).toContain('ticket-hoverable');
	}

	async function mainTicketHandler(action) {
		await mainTicket.click();

		const ticketFlip = () => document.querySelector('.ticket-back-content').classList.contains('flipped');

		await page.waitForFunction(ticketFlip, 5000);

		await page.waitForTimeout(500);
		closeBtn = await page.waitForSelector('#close-ticket');
		await closeBtn.click();

		if (action) {
			saveBtn = await page.waitForSelector('#save-button');
			await saveBtn.click();
			const updateCount = () => document.querySelector('#ticket-count').innerText === '1';
			await page.waitForFunction(updateCount, 3000);
			await checkTicketCount(1);
		} else {
			discardBtn = await page.waitForSelector('#discard-button');
			await discardBtn.click();
			await checkTicketCount(0);
		}
	}

	async function deleteSavedTicket() {
		countTicketBtn = await page.waitForSelector('.count-tickets-icon');
		await countTicketBtn.click();
		await page.waitForTimeout(2000);

		const historyWrapperAppears = () => document.querySelector('.history-wrapper').classList.length === 1;

		await page.waitForFunction(historyWrapperAppears, 5000);

		const historicalTickets = await page.$$('historical-ticket');
		const shadowRoot = await historicalTickets[0].getProperty('shadowRoot');

		const overlay = await shadowRoot.waitForSelector('.ticket-flip-overlay');

		await overlay.hover();

		discardBtn = await shadowRoot.$('.discard-history-button');

		await discardBtn.click();
		await checkTicketCount(0);
	}

	/**
	 * Clicks on the top right settings button
	 * Call this function AFTER loadPagePastSplashScreen(url)
	 * @param none
	 */
	async function clickSettingsButton() {
		const settingsBtn = await page.waitForSelector('.settings-menu-button');
		await settingsBtn.click();
	}

	/**
	 * Tests sliding in of settings menu after button is clicked.
	 * @param none
	 */
	async function testSettingsMenuSliding() {
		await clickSettingsButton();

		// Checks for 'settings-slide-in' class within settings menu
		testData.classList = await getClassList('.settings-menu-settings');
		expect(Object.values(testData.classList)).toContain('settings-slide-in');

		await clickSettingsButton();

		// Checks for absense of 'settings-slide-in' class within settings menu
		testData.classList = await getClassList('.settings-menu-settings');
		expect(Object.values(testData.classList)).not.toContain('settings-slide-in');
	}

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
	} /* testEightBall */

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
	} /* testSplashScreen */

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
	} /* loadPagePastSplashScreen */

	it('(UI) pressing anywhere on screen removes splash screen', async () => {
		await loadPagePastSplashScreen(URL_2D);
		await testSplashScreen(URL_2D);
	}, 0);

	it('(UI) pressing on eight ball redirects to Magic 8 Ball', async () => {
		await loadPagePastSplashScreen(URL_2D);
		await testEightBall();
	}, 0);

	it('(UI) pressing settings button makes menu appear on screen', async () => {
		await loadPagePastSplashScreen(URL_2D);
		await testSettingsMenuSliding();
	});

	it('(User flow) Save ticket, then delete Ticket', async () => {
		await loadPagePastSplashScreen(URL_2D);
		await generateMainTicket();
		await mainTicketHandler(SAVE);
		await deleteSavedTicket();
	});

	it('(User flow) Generate ticket, then discard it', async () => {
		await loadPagePastSplashScreen(URL_2D);
		await generateMainTicket();
		await mainTicketHandler(DISCARD);
	});

	afterEach(async () => {
		await page.close();
		await browser.close();
	});
}, 180000);
