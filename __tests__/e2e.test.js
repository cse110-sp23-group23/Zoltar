import puppeteer from 'puppeteer';

describe('Basic user flow', () => {
    let browser;
    let page;

    beforeAll(async () => {
        browser = await puppeteer.launch({headless: false});
	    page = await browser.newPage();
        await page.goto('http://localhost:5500/index2d.html');
    })

	it('(2D) pressing anywhere on screen removes splash screen', async () => {
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

    it('(2D) checking if the number of ticket is 0', async () => {
        const ticketCount = await page.$('#ticket-count');
        const innerText = await ticketCount.getProperty('innerText');
        const value = await innerText.jsonValue();

        expect(value).toBe('0');
    });

    it('checking if ticket can be generated', async () => {
        const zoltar = await page.$('#eight-ball-container');

        // generate a ticket
        await zoltar.click();
        await page.waitForTimeout(2000);
        
        let classList = await page.evaluate((el) => el.classList, zoltar);
        expect(Object.values(classList)).toContain('ticket-hoverable');
    });

    it('(2D) checking if the number of ticket is 1 after saving 1 new ticket', async () => {
        const zoltar = await page.$('#eight-ball-container');
        const ticket = await page.waitForSelector('#ticket-wrapper');
        const closeTicketBtn = await page.waitForSelector('#close-ticket');
        const saveBtn = await page.waitForSelector('#save-button');

        zoltar.click();
        // flip the ticket
        setTimeout(async () => {
            await ticket.click();
        }, "6000");
        
        // close it
        setTimeout(async () => {
            await closeTicketBtn.click();
        }, "5000");

        // save it
        setTimeout(async () => {
            await saveBtn.click();
        }, "3000");
        
        const ticketCount = await page.$('#ticket-count');
        const innerText = await ticketCount.getProperty('innerText');
        const value = await innerText.jsonValue();

        expect(value).toBe('1');
        expect(numOfTicketLocal).toBe('1');
    });
    
    it('(2D) checking if the number of ticket is 1 if not saving the new ticket', async () => {
        const zoltar = await page.waitForSelector('#eight-ball-container');
        const ticket = await page.waitForSelector('.ticket-wrapper');
        const closeTicketBtn = await page.waitForSelector('#close-ticket');
        const discardBtn = await page.$('#discard-button');
        
        // generate a ticket
        zoltar.click();

        // flip the ticket
        setTimeout(async () => {
            await ticket.click();
        }, "5000");
        
        // close it
        setTimeout(async () => {
            await closeTicketBtn.click();
        }, "3000");

        // discard it
        setTimeout(async () => {
            await discardBtn.click();
        }, "3000");

        const ticketCount = await page.$('#ticket-count');
        const innerText = await ticketCount.getProperty('innerText');
        const value = await innerText.jsonValue();

        expect(value).toBe('1');
    });

    it('(2D) checking if the number of tickets is 0 after discard 1 ticket', async () => {
        const countTicketIcon = await page.$('#count-tickets-icon');
        const discardHistory = await page.$('#discard-history-button');
        
        setTimeout(async () => {
            await countTicketIcon,click();
        }, "1000");
        setTimeout(async () => {
            await discardHistory.click();
        }, "1000");

        const ticketCount = await page.$('#ticket-count');
        const innerText = await ticketCount.getProperty('innerText');
        const value = await innerText.jsonValue();

        expect(value).toBe('0');
    });
    
    it ('(2D) end testing', async () => {
        await page.close();
        await browser.close();
    });
    
}, 120000);
