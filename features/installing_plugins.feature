Feature: Installing Plugins
  As a user of Zazu
  I want to install extensions from other users
  So I can be more productive

  Scenario: Install calculator plugin
    Given I have "tinytacoteam/zazu-calculator" as a plugin
    And the app is launched
    When I toggle it open
    And I type in "21 * 2"
    Then the search window is visible
    And I have 1 results
    And the results contain "42"

  Scenario: Install and update calculator plugin
    Given I have "tinytacoteam/zazu-calculator" as a plugin
    And the app is launched
    And I update the plugins
    When I toggle it open
    And I type in "21 * 2"
    Then the search window is visible
    And I have 1 results
    And the results contain "42"
