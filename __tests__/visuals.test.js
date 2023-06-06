/*
 * @jest-environment node
 */
/* eslint-disable import/no-extraneous-dependencies */
import percySnapshot from '@percy/puppeteer';
import puppeeter from 'puppeteer';

describe('visual testing thru percy.io', () => {
	it('loads the homepage', async () => {
		const browser = await puppeeter.launch();
		const page = await browser.newPage();
		await page.goto('http://localhost:5500');
		await percySnapshot(page, 'Loading page image');

		page.close();
		browser.close();
	});
});
