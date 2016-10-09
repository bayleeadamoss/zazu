Feature: Accessibility
  As a user of Zazu
  I want to use accessibility options
  So I can be more productive

  Scenario: Copy to Clipboard
    Given I have "tinytacoteam/zazu-fixture" as a plugin
    And the app is launched
    When I toggle it open
    And I type in "tinytacoteam"
    Then the search window is visible
    And I have no accessibility warnings
