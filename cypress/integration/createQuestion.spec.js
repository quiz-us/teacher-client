const { TEACHER_STAGING } = Cypress.env();

describe('creating a question', () => {
  before(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    // deletes auth token, effectively logging user out:
    indexedDB.deleteDatabase('localforage');
    cy.visit(TEACHER_STAGING);
    cy.loginTeacher();
  });
  beforeEach(() => {
    cy.get("button[aria-label='menu']").click();
    cy.contains('Deck Creator').click({ force: true });
    cy.location('pathname').should('eq', '/deck-creator');
  });

  it('can create a free response question', () => {
    // select Free Response
    cy.contains('Multiple Choice').click();
    cy.get("li[data-value='Free Response']").click();

    // select Standard
    cy.get('#mui-component-select-standardId').click();
    cy.contains('8.5(C)').click();

    // fill out multiple tags
    cy.get("input[placeholder='Add one or more tag(s)']").type(
      'elements{enter}'
    );
    cy.get("input[placeholder='Add one or more tag(s)']").type(
      'Periodic Table{enter}'
    );

    // fill out question
    const questionEditor = cy.get("div[data-slate-editor='true']").first();
    questionEditor.click();
    questionEditor.type('What is the symbol for helium?');
    // fill out question
    const answerEditor = cy.get("div[data-slate-editor='true']").last();
    answerEditor.click();
    answerEditor.type('The symbol for helium is He.');

    cy.get("button[type='submit']").click();
    cy.contains('No cards in this deck yet').should('not.exist');
  });

  // it('displays feedback if all required fields are not submitted');
});
