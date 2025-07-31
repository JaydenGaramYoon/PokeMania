describe("LogIn", () => {
  it("tests LogIn", () => {
    cy.viewport(1208, 869);
    cy.visit("http://localhost:3000/");
    cy.get("input[type='email']").click();
    cy.get("input[type='email']").type("example12@example12.com");
    cy.get("input[type='password']").type("example12");
    cy.get("button:nth-of-type(1)").click();
  });
});
//# recorderSourceMap=BCBDBEBFBGAGAGBHB
