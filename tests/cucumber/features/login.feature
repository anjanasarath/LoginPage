Feature: Login
  As a User of Privacy Perfect
  I should be able to login with valid credentials

  Scenario: Login with invalid username
    Given I am on the login page
    And I fill in "Your e-mail address" with "blah"
    And I fill in "Your password" with "circus"
    When I click on the "Log in now" button
    Then I should see "Incorrect e-mail and password combination. Please try again."

  Scenario: Login with invalid password
    Given I am on the login page
    And I fill in "Your e-mail address" with "pipo@circus.org"
    And I fill in "Your password" with "fakepassword"
    When I click on the "Log in now" button
    Then I should see "Incorrect e-mail and password combination. Please try again."

  Scenario: Login with valid credentials
    Given I am on the login page
    And I fill in "Your e-mail address" with "pipo@circus.org"
    And I fill in "Your password" with "circus"
    When I click on the "Log in now" button
    Then I should see "pipo clown"

  Scenario: Login with valid credentials and expired token
    Given my token is no longer valid
    And I am on the login page
    And I fill in "Your e-mail address" with "pipo@circus.org"
    And I fill in "Your password" with "circus"
    When I click on the "Log in now" button
    Then I should see "pipo clown"

  # This scenario will not work properly in MS Edge 14
  # until the postmethod promise issue is fixed
  Scenario: Login with valid credentials and expired token after page refreshed
    Given my token is no longer valid
    And I refresh the page
    And I fill in "Your e-mail address" with "pipo@circus.org"
    And I fill in "Your password" with "circus"
    When I click on the "Log in now" button
    Then I should see "pipo clown"
