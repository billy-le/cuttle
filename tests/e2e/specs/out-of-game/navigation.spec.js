import { playerOne } from '../../fixtures/userFixtures';

describe('Navigation Drawer', () => {
  beforeEach(() => {
    cy.wipeDatabase();
    cy.visit('/');
  });
  it('Expands and collapses navbar on desktop and always collapses on mobile', () => {
    // Desktop display
    cy.viewport(1920, 1080);
    cy.get('[data-cy=nav-drawer]')
      .should('be.visible')
      .should('contain', 'Login')
      .should('contain', 'Rules')
      .should('not.have.class', 'v-navigation-drawer--mini-variant')
      // Collapse nav
      .find('[data-cy=collapse-nav]')
      .click();
    // Nav drawer should be collapsed
    cy.get('[data-cy=nav-drawer]')
      .should('have.class', 'v-navigation-drawer--mini-variant')
      // Expand nav
      .find('[data-cy=expand-nav]')
      .click();
    // Should be expanded again
    cy.get('[data-cy=nav-drawer]')
      .should('be.visible')
      .should('contain', 'Login')
      .should('contain', 'Rules')
      .should('not.have.class', 'v-navigation-drawer--mini-variant');

    // Mobile display
    cy.viewport('iphone-8');
    cy.get('[data-cy=nav-drawer]')
      .should('be.visible')
      .should('have.class', 'v-navigation-drawer--mini-variant')
      // Collapse and expand buttons not displayed on mobile
      .find('[data-cy=expand-nav]')
      .should('not.exist');
    cy.get('[data-cy=collapse-nav]').should('not.exist');
  });

  it('Navigates to Login and Rules pages when unauthenticated', () => {
    cy.get('[data-nav]').should('have.length', 2);
    cy.get('[data-nav=Rules]').click();
    cy.hash().should('equal', '#/rules');
    cy.get('[data-nav=Login]').click();
    cy.hash().should('equal', '#/login');
  });
  describe('Navigates to Rules, Home, Stats, and Login pages', () => {
    function verifyAuthenticatedLinks() {
      cy.get('[data-nav]').should('have.length', 4);
      cy.hash().should('equal', '#/');
      // Navigate to Rules
      cy.get('[data-nav=Rules]').click();
      cy.hash().should('equal', '#/rules');
      // Navigate to Home (Play)
      cy.get('[data-nav=Play]').click();
      cy.hash().should('equal', '#/');
      // Navigate to Stats
      cy.get('[data-nav=Stats]').click();
      cy.hash().should('equal', '#/stats');
      // Log out
      cy.get('[data-nav=Logout]').click();
      cy.hash().should('equal', '#/login');
    }
    beforeEach(() => {
      cy.signupPlayer(playerOne.username, playerOne.password);
      cy.vueRoute('/');
    });
    it('When authenticated', () => {
      verifyAuthenticatedLinks();
    });
    it('When authenticated on reload', () => {
      cy.reload();
      verifyAuthenticatedLinks();
    });
  });
});
