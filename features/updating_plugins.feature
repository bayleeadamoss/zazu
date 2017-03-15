Feature: Updating Plugins
  As a user of Zazu
  I want to update plugins
  So I can have the latest productivity tools

  Scenario: Before update
    Given I have "tinytacoteam/zazu-fallback" installed before packagist support
    And the app is launched
    When I toggle it open
    And I type in "packagist prettyarray"
    Then the search window is visible
    And I have no results

  Scenario: Update plugin
    Given I have "tinytacoteam/zazu-fallback" installed before packagist support
    And the app is launched
    And I update the plugins
    When I toggle it open
    And I type in "packagist prettyarray"
    Then the search window is visible
    And I have 1 result
    And the active result contains "Search Packagist for prettyarray"
