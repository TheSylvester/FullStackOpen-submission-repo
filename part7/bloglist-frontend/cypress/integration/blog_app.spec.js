describe("Blog app", function () {
  beforeEach(function () {
    cy.request("POST", "http://localhost:3003/api/testing/reset");

    const initialUser = {
      username: "TheSylvester",
      name: "Sylvester Wong",
      password: "pass"
    };
    cy.request("POST", "http://localhost:3003/api/users", initialUser);

    cy.visit("http://localhost:3000");
  });

  it("Login form is shown first", function () {
    cy.contains("log in to application");
  });

  describe("Login", function () {
    it("succeeds with correct credentials", function () {
      cy.contains("log in").click();
      cy.get("input[name='Username'").type("TheSylvester");
      cy.get("input[name='Password'").type("pass");
      cy.get("button").click();

      cy.contains("logged in");
    });

    it("fails with wrong credentials", function () {
      cy.contains("log in").click();
      cy.get("input[name='Username'").type("TheSylvester");
      cy.get("input[name='Password'").type("BADpass");
      cy.get("button").click();
      cy.contains("Invalid Username or Password");
    });
  });

  describe("When logged in", function () {
    beforeEach(function () {
      // log in user here
      cy.contains("log in").click();
      cy.get("input[name='Username'").type("TheSylvester");
      cy.get("input[name='Password'").type("pass");
      cy.get("button").click();
      cy.contains("logged in");
    });

    it("A blog can be created", function () {
      cy.contains("create new").click();
      cy.get("input[name='title'").type("Marry me Juliet");
      cy.get("input[name='author'").type("Taylor Swift");
      cy.get("input[name='url'").type("http://www.taylorswift.com");
      cy.get("button[type='submit'").click();
      cy.contains("Marry me Juliet");
    });

    it("A blog can be liked", function () {
      cy.contains("create new").click();
      cy.get("input[name='title'").type("Marry me Juliet");
      cy.get("input[name='author'").type("Taylor Swift");
      cy.get("input[name='url'").type("http://www.taylorswift.com");
      cy.get("button[type='submit'").click();
      cy.contains("Marry me Juliet");
      cy.get("button").contains("view").click();
      cy.get("button").contains("like").click();
      cy.contains("Likes: 1");
    });
    it("A blog can be removed", function () {
      cy.contains("create new").click();
      cy.get("input[name='title'").type("Marry me Juliet");
      cy.get("input[name='author'").type("Taylor Swift");
      cy.get("input[name='url'").type("http://www.taylorswift.com");
      cy.get("button[type='submit'").click();
      cy.contains("Marry me Juliet");
      cy.get("button").contains("view").click();
      cy.get("button").contains("remove").click();
      cy.wait(2000);
      cy.get("[data-cy='Marry me Juliet']").should("not.be.visible");
    });
  });
});
