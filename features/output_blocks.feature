Feature: Output Blocks
  As a user of Zazu
  I want to use all the available block types
  So I can be more productive

  Scenario: Copy to Clipboard
    Given I have "tinytacoteam/zazu-fixture" as a plugin
    And the app is launched
    When I toggle it open
    And I type in "tinytacoteam"
    And I eventually click on the active result
    Then the search window is not visible
    And my clipboard contains "tinytacoteam"

  Scenario: User Script + Copy to Clipboard
    Given I have "tinytacoteam/zazu-fixture" as a plugin
    And the app is launched
    When I toggle it open
    And I type in "food taco"
    And I eventually click on the active result
    Then the search window is not visible
    And my clipboard contains "GMO tiny taco"
