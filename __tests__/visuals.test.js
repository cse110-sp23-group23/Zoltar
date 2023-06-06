/* eslint-disable import/no-extraneous-dependencies */
/*
 * @jest-environment node
 */
import percySnapshot from '@percy/puppeteer';
import puppeeter from 'puppeteer';

describe('visual testing thru percy.io', () => {
	it('loads the homepage', async () => {
		const browser = await puppeeter.launch();
		const page = await browser.newPage();
		await page.goto('https://zoltar.live');
		await percySnapshot(page, 'Basic image');
	});
});
