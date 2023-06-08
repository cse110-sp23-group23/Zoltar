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

	afterEach(() => {
		page.close();
		browser.close();
	});
});
