Feature: Open
  As a user of Zazu
  I want to open the app
  So I can be more productive

  Scenario: Opening Zazu
    Given I have "tinytacoteam/zazu-fixture" as a plugin
    And the app is launched
    When I toggle it open
    Then the search window is visible
