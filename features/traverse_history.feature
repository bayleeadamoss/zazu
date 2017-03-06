Feature: Traverse History
  As a user of Zazu
  I want to be able to scroll through previous searches
  So I can do the remembering

  Scenario: Clears result when it closes
    Given I have "tinytacoteam/zazu-fixture" as a plugin
    And the app is launched
    When I toggle it open
    And I type in "taco"
    And I toggle it closed
    And I toggle it open
    Then the input is empty

  Scenario: Scroll up
    Given I have "tinytacoteam/zazu-fixture" as a plugin
    And the app is launched
    When I toggle it open
    And I type in "tiny"
    And I toggle it closed
    And I toggle it open
    And I type in "taco"
    And I toggle it closed
    And I toggle it open
    And I type in "team"
    And I toggle it closed
    And I toggle it open
    And I hit the hotkey "up"
    And I hit the hotkey "up"
    Then the input is "taco"

  Scenario: Scroll down
    Given I have "tinytacoteam/zazu-fixture" as a plugin
    And the app is launched
    When I toggle it open
    And I type in "tiny"
    And I toggle it closed
    And I toggle it open
    And I type in "taco"
    And I toggle it closed
    And I toggle it open
    And I type in "team"
    And I toggle it closed
    And I toggle it open
    And I hit the hotkey "up"
    And I hit the hotkey "up"
    And I hit the hotkey "up"
    And I hit the hotkey "down"
    And I hit the hotkey "down"
    Then the input is "team"
