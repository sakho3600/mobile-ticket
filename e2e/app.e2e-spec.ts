import { MobileTicketPage } from './app.po';

describe('mobile-ticket App', function() {
  let page: MobileTicketPage;

  beforeEach(() => {
    page = new MobileTicketPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
