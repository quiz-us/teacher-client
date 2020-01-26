const faker = require('faker');

const { TEACHER_STAGING } = Cypress.env();

describe('creating a class period', () => {
  before(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    // deletes auth token, effectively logging user out:
    indexedDB.deleteDatabase('localforage');
    cy.visit(TEACHER_STAGING);
    cy.loginTeacher();
  });

  const firstName = 'John';
  const lastName = 'Jacob';
  const email = 'jjexample@gmail.com';

  it('can create a new class period and add a student', () => {
    cy.get("button[aria-label='menu']").click();
    cy.contains('Class Manager').click({ force: true });
    cy.location('pathname').should('eq', '/class-manager');

    cy.contains('Create Class').click();
    const randomClassName = faker.random.uuid();
    cy.get('input').type(`${randomClassName}{enter}`);

    // not able to create class period with same names
    cy.get('input').should('have.value', '');
    cy.get('input').type(`${randomClassName}{enter}`);
    cy.contains('Name has already been taken').should('exist');
    cy.contains('Close').click();

    cy.contains(randomClassName).click({ force: true });

    cy.contains('Add Student').click();

    cy.get("input[name='firstName']").type(firstName);
    cy.get("input[name='lastName']").type(lastName);
    cy.get("input[name='email']").type(email);
    cy.contains('Create').click();
    cy.contains(email).should('exist');
  });

  it('can edit student info', () => {
    cy.get("button[title='Edit']").click();
    const firstNameInput = cy.get("input[placeholder='First Name']");
    const updatedFirstName = faker.name.firstName();
    firstNameInput.clear();
    firstNameInput.type(updatedFirstName);
    cy.get("button[title='Save']").click();
    cy.contains(updatedFirstName);
  });

  it('can unenroll a student', () => {
    cy.get("button[title='Delete']").click();
    cy.get("button[title='Save']").click();
    cy.contains(email).should('not.exist');
    cy.contains('Success!').should('exist');
  });
});
