import { H2developerPage } from './app.po';

describe('h2developer App', () => {
  let page: H2developerPage;

  beforeEach(() => {
    page = new H2developerPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
