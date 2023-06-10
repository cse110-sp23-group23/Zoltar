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
		browser = await puppeteer.launch();
		page = await browser.newPage();
	});

	it('(3D) loads the homepage', async () => {
		await page.goto('http://localhost:5500');
		await percySnapshot(page, 'Loading 3D page image');
	});

	it('(2D) loads the homepage', async () => {
		await page.goto('http://localhost:5500/twodee.html');
		await percySnapshot(page, 'Loading 2D page image');
	});

	it('(3D) pressing anywhere on screen removes splash screen', async () => {
		await page.goto('http://localhost:5500/index2d.html');
		const splashScreen = await page.$('#splash-screen');
		let classList = await page.evaluate((el) => el.classList, splashScreen);
		const classBefore = Object.keys(classList).length;

		await splashScreen.click();
		await page.waitForTimeout(1000);

		classList = await page.evaluate((el) => el.classList, splashScreen);
		const classAfter = Object.keys(classList).length;

		expect(classAfter).toBe(classBefore + 2);
		expect(Object.values(classList)).toContain('hidden', 'no-opacity');
	});

	it('(2D) pressing anywhere on screen removes splash screen', async () => {
		await page.goto('http://localhost:5500/index2d.html');
		const splashScreen = await page.$('#splash-screen');
		let classList = await page.evaluate((el) => el.classList, splashScreen);
		const classBefore = Object.keys(classList).length;

		await splashScreen.click();
		await page.waitForTimeout(1000);

		classList = await page.evaluate((el) => el.classList, splashScreen);
		const classAfter = Object.keys(classList).length;

		expect(classAfter).toBe(classBefore + 2);
		expect(Object.values(classList)).toContain('hidden', 'no-opacity');
	});

	afterEach(() => {
		page.close();
		browser.close();
	});
});
