const { TEACHER_STAGING, DUMMY_EMAIL, DUMMY_PW } = Cypress.env();

beforeEach(() => {
  cy.clearCookies();
  cy.clearLocalStorage();
  // deletes auth token, effectively logging user out:
  indexedDB.deleteDatabase('localforage');
});

describe('login', () => {
  it('can login', () => {
    cy.visit(TEACHER_STAGING);
    // it redirects to login:
    cy.location('pathname').should('eq', '/login');
    cy.get('input[type="email"]').type(DUMMY_EMAIL);
    cy.get('input[type="password"]').type('wrongpassword{enter}');
    cy.contains('Incorrect username and/or password. Please try again.', { timeout: 10000 }).should('exist');

    cy.get('input[type="password"]').clear();
    cy.get('input[type="password"]').type(`${DUMMY_PW}{enter}'`);
    cy.location('pathname').should('eq', '/');
  });
});
