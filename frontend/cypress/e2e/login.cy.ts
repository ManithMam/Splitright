describe('Mocks log in data from API, logs in and logs out', () => {

  beforeEach(() => {
      cy.intercept('POST', '**/login', { fixture: 'login_mock_data.json' })
      cy.visit('http://localhost:3000/login')
  })
  it('Inputs mock user info, logs in, and logs out', () => {
  cy.visit('/login')
  cy.get('.InputArea')
    .find('input[type="text"]')
    .type('john00');

  cy.get('.InputArea')
    .find('input[type="password"]')
    .type('password');

  cy.get('.MainBtn')
    .click();

  cy.url().should('include', '/home');

  cy.contains('Logout').click();

  cy.url().should('include', '/login');
})
})