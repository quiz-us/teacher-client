// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
const { DUMMY_EMAIL, DUMMY_PW } = Cypress.env();

Cypress.Commands.add('loginTeacher', () => {
  cy.get('input[type="email"]').type(DUMMY_EMAIL);
  cy.get('input[type="password"]').type(`${DUMMY_PW}{enter}'`);
  cy.location('pathname', { timeout: 10000 }).should('eq', '/');
});
