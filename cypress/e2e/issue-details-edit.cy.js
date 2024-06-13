const BASE_URL = Cypress.env('baseUrl');
const ISSUE_TYPE = 'Task';
const MODAL_SELECTOR = '[data-testid="modal:issue-details"]';
const PRIORITY_SELECTION = '[data-testid="select:priority"]';
const SELECT_OPTIONS = '[data-testid^="select-option:"]';
const REPORTER_SELECTION = '[data-testid="select:reporter"]';
const BACKLOG_LIST = '[data-testid="board-list:backlog"]';
const UNTRIMMED_TITLE = 'Untrimmed     Title for    Bonus   Tests';

let priorities = [];
const EXPECTED_LENGTH_PRIORITY = 5;

describe('Issue details editing', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.url().should('eq', `${BASE_URL}project`).then((url) => {
      cy.visit(url + '/board');
      cy.contains(`This is an issue of type: ${ISSUE_TYPE}.`).click();
    });
  });

  it('Should update type, status, assignees, reporter, priority successfully', () => {
    updateIssueDetails();
  });

  it('Should update title, description successfully', () => {
    updateTitleAndDescription('TEST_TITLE', 'TEST_DESCRIPTION');
  });

  it('Should check the options of Priority dropdown', () => {
    checkPriorityDropdownOptions();
  });

  it('Should check that reporter name has only characters in it', () => {
    checkReporterNameCharacters();
  });

  it('Should remove unnecessary spaces on the board view', () => {
    removeUnnecessarySpaces();
  });
});

const getIssueDetailsModal = () => cy.get(MODAL_SELECTOR);

function updateIssueDetails() {
  getIssueDetailsModal().within(() => {
    selectDropdownOption('type', 'Story');
    verifyDropdownOption('type', 'Story');

    selectDropdownOption('status', 'Done');
    verifyDropdownOption('status', 'Done');

    selectMultipleDropdownOptions('assignees', ['Lord Gaben', 'Baby Yoda']);
    verifyDropdownOptions('assignees', ['Lord Gaben', 'Baby Yoda']);

    selectDropdownOption('reporter', 'Pickle Rick');
    verifyDropdownOption('reporter', 'Pickle Rick');

    selectDropdownOption('priority', 'Medium');
    verifyDropdownOption('priority', 'Medium');
  });
}

function updateTitleAndDescription(title, description) {
  getIssueDetailsModal().within(() => {
    cy.get('textarea[placeholder="Short summary"]').clear().type(title).blur();
    cy.get('.ql-snow').click().should('not.exist');
    cy.get('.ql-editor').clear().type(description);
    cy.contains('button', 'Save').click().should('not.exist');
    cy.get('textarea[placeholder="Short summary"]').should('have.value', title);
    cy.get('.ql-snow').should('contain.text', description);
  });
}

function checkPriorityDropdownOptions() {
  getIssueDetailsModal().within(() => {
    cy.get(PRIORITY_SELECTION).invoke('text').then((selectedPriority) => {
      priorities.push(selectedPriority);
      cy.log(`Length of array: ${priorities.length}`);
    });
    cy.get(PRIORITY_SELECTION).click();
    cy.get(SELECT_OPTIONS).each(($el) => {
      cy.wrap($el).invoke('text').then((priorityOption) => {
        priorities.push(priorityOption);
        cy.log(`Value added: ${priorityOption}`);
        cy.log(`Length of array: ${priorities.length}`);
      });
    }).then(() => {
      expect(priorities.length).to.eq(EXPECTED_LENGTH_PRIORITY);
      cy.log(`Priorities array: ${priorities}`);
    });
  });
}

function checkReporterNameCharacters() {
  getIssueDetailsModal().within(() => {
    cy.get(REPORTER_SELECTION).invoke('text').then((reporterName) => {
      cy.log(`Reporter name: ${reporterName}`);
      expect(reporterName).to.match(/^[A-Za-z\s]+$/);
    });
    cy.get(REPORTER_SELECTION).click();
    cy.get(SELECT_OPTIONS).should('be.visible');
    cy.get(SELECT_OPTIONS).each(($el) => {
      cy.wrap($el).invoke('text').then((reporterName) => {
        cy.log(`Reporter name: ${reporterName}`);
        expect(reporterName).to.match(/^[A-Za-z\s]+$/);
      });
    });
  });
}

function removeUnnecessarySpaces() {
  closeIssueDetailView();
  openCreateNewIssue();
  getIssueTitle().click().type(UNTRIMMED_TITLE);
  clickCreateIssueButton();
  ensureIssueIsCreated();

  cy.get(BACKLOG_LIST).children().first().find('p').invoke('text').should('eq', UNTRIMMED_TITLE.trim());
}

const selectDropdownOption = (field, option) => {
  cy.get(`[data-testid="select:${field}"]`).click('bottomRight');
  cy.get(`[data-testid="select-option:${option}"]`).click();
};

const verifyDropdownOption = (field, option) => {
  cy.get(`[data-testid="select:${field}"]`).should('contain.text', option);
};

const selectMultipleDropdownOptions = (field, options) => {
  options.forEach(option => {
    cy.get(`[data-testid="select:${field}"]`).click('bottomRight');
    cy.get(`[data-testid="select-option:${option}"]`).click();
  });
};

const verifyDropdownOptions = (field, options) => {
  options.forEach(option => {
    cy.get(`[data-testid="select:${field}"]`).should('contain.text', option);
  });
};

const closeIssueDetailView = () => cy.get('[data-testid="icon:close"]').first().click();
const openCreateNewIssue = () => cy.get('[data-testid="icon:plus"]').click();
const getIssueTitle = () => cy.get('[data-testid="form-field:title"]');
const clickCreateIssueButton = () => cy.get('button[type="submit"]').click();

function ensureIssueIsCreated() {
  cy.get('[data-testid="modal:issue-create"]').should('not.exist');
  cy.contains('Issue has been successfully created.').should('be.visible');
  cy.reload();
  cy.contains('Issue has been successfully created.').should('not.exist');
  cy.get(BACKLOG_LIST).should('be.visible').and('have.length', 1).within(() => {
    cy.get('[data-testid="list-issue"]').should('have.length', 5);
  });
}
