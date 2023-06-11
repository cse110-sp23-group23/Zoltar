/*
 * @jest-environment node
 */
/* eslint-disable import/no-extraneous-dependencies */
import percySnapshot from '@percy/puppeteer';
import puppeteer from 'puppeteer';

describe('visual testing thru percy.io', () => {
	let browser;
	let page;

	beforeEach(async () => {
		browser = await puppeteer.launch({ headless: 'new' });
		page = await browser.newPage();
	});

	it('(3D) loads the homepage', async () => {
		await page.goto('http://localhost:5500/index.html');
		await new Promise((r) => { setTimeout(r, 1000); });
		await percySnapshot(page, 'Loading 3D page image');
	});

	it('(2D) loads the homepage', async () => {
		await page.goto('http://localhost:5500/index2d.html');
		await new Promise((r) => { setTimeout(r, 1000); });
		await percySnapshot(page, 'Loading 2D page image');
	});

	async function testSplashOnURL(url) {
		await page.goto(url);
		const splashScreen = await page.$('#splash-screen');
		let classList = await page.evaluate((el) => el.classList, splashScreen);
		const classBefore = Object.keys(classList).length;

		const fn = () => document.querySelector('.loaded-message').innerText.toLowerCase() !== 'loading...';
		await page.waitForFunction(fn, 60000);
		await splashScreen.click();
		await new Promise((r) => { setTimeout(r, 5000); });

		classList = await page.evaluate((el) => el.classList, splashScreen);
		const classAfter = Object.keys(classList).length;

		expect(classAfter).toBe(classBefore + 2);
		expect(Object.values(classList)).toContain('hidden');
		expect(Object.values(classList)).toContain('no-opacity');
	}

	it('(3D) pressing anywhere on screen removes splash screen', async () => {
		await testSplashOnURL('http://localhost:5500/index.html');
	}, 60000);

	it('(2D) pressing anywhere on screen removes splash screen', async () => {
		await testSplashOnURL('http://localhost:5500/index2d.html');
	}, 30000);

	afterEach(async () => {
		await page.close();
		await browser.close();
	});
}, 120000);
