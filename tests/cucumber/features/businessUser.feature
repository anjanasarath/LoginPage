Feature: Business User
  If I have the role Business User
  I will have restricted access

  Scenario: Environment link on main page
    Given I have the role "businessUser"
    When I log in
    Then I should not see the "Environment" button

  Scenario: Access the Environment Page
    Given I am logged in as "business User"
    When I visit the "environment" page
    Then I should not see the "Environment" button
