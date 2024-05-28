/// <reference types="cypress" />

describe('Issue Deletion', () => {
    beforeEach(() => {
      cy.visit('/');
      cy.url().should('eq', `${Cypress.env('baseUrl')}project`).then((url) => {
        cy.visit(url + '/board');
        cy.contains('This is an issue of type: Task.').click();
        getIssueDetailsModal().should('be.visible');
      });
    });

// TEST CASE 1, issue deletion //
    it('Should delete an issue', () => {
      getIssueDetailsModal().within(() => {
        cy.get('[data-testid="icon:trash"]').click();
      });
      cy.get('.dIxFno > .sc-bxivhb').should('be.visible').click();
      cy.get('[data-testid="modal:confirm-delete"]').should('not.exist');
      cy.get('.sc-kaNhvL').should('not.contain', 'This is an issue of type: Task.');
    });
  
// TEST CASE 2, issue deletion cancellation //
    it('Should cancel issue deletion', () => {
      getIssueDetailsModal().within(() => {
        cy.get('[data-testid="icon:trash"]').click();
      });
      cy.get('.sc-kgoBCf > .ewzfNn > .sc-bxivhb').should('be.visible').click();
      cy.get('[data-testid="modal:confirm-delete"]').should('not.exist');
      cy.get('.sc-kaNhvL').should('contain', 'This is an issue of type: Task.');
    });
  
    const getIssueDetailsModal = () => cy.get('[data-testid="modal:issue-details"]');
  });