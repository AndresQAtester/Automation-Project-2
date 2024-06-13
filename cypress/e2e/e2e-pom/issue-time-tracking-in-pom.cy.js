import IssueTimeTracking from "../../pages/IssueTimeTracking.js";

// Helper function to create an issue
function createAndOpenIssue() {
  IssueTimeTracking.createIssue(
    IssueTimeTracking.randomDescription,
    IssueTimeTracking.randomTitle
  );
  
  cy.wait(6000);
  cy.get(IssueTimeTracking.listIssue, IssueTimeTracking.timeout).should(
    "be.visible"
  );

  cy.contains(IssueTimeTracking.randomTitle, IssueTimeTracking.timeout)
    .should("be.visible")
    .click();
}

// Custom Cypress command to initialize the test
Cypress.Commands.add("initTest", () => {
  cy.visit("/");

  cy.url().should("eq", `${Cypress.env("baseUrl")}project/board`).then((url) => {
    cy.visit(url + "/board");
    createAndOpenIssue();
  });
});

describe("Issue time tracking in POM", () => {
  beforeEach(() => {
    cy.initTest();
  });

  it("Adding, editing and removing original estimated hours", () => {
    IssueTimeTracking.validateEmptyTimeFields();
    
    IssueTimeTracking.addNewEstimation(false);

    IssueTimeTracking.logTime(
      false,
      IssueTimeTracking.randomTimeLogged,
      IssueTimeTracking.timeSpentInputInModal,
      "logged"
    );

    IssueTimeTracking.logTime(
      true,
      IssueTimeTracking.randomRemaining,
      IssueTimeTracking.timeRemainingInputInModal,
      "remaining"
    );

    IssueTimeTracking.editEstimation(true, true);
    
    IssueTimeTracking.editLogTime(
      true,
      IssueTimeTracking.randomTimeLoggedChanged,
      IssueTimeTracking.timeSpentInputInModal,
      "logged"
    );

    IssueTimeTracking.editLogTime(
      true,
      IssueTimeTracking.randomRemainingChanged,
      IssueTimeTracking.timeRemainingInputInModal,
      "remaining"
    );

    IssueTimeTracking.deleteEstimateTime();

    IssueTimeTracking.deleteLogTime(
      IssueTimeTracking.randomTimeLoggedChanged,
      IssueTimeTracking.timeSpentInputInModal
    );

    IssueTimeTracking.timeAssertion(
      false,
      true,
      false,
      IssueTimeTracking.randomTimeLoggedChanged,
      "logged"
    );

    IssueTimeTracking.deleteLogTime(
      IssueTimeTracking.randomRemainingChanged,
      IssueTimeTracking.timeRemainingInputInModal
    );

    IssueTimeTracking.validateEmptyTimeFields();
  });
});
