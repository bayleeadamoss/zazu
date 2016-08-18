Feature: Navigation
  As a user of Zazu
  I want to be able to scroll through results
  So I can select the most relevant result

  Scenario: Assert first result
    Given I have "tinytacoteam/zazu-fixture" as a plugin
    And the app is launched
    When I toggle it open
    And I type in "food tiny"
    Then the active result contains "tiny taco"

  Scenario: Scroll down to second result
    Given I have "tinytacoteam/zazu-fixture" as a plugin
    And the app is launched
    When I toggle it open
    And I type in "food tiny"
    And I hit the hotkey "control+n"
    Then the active result contains "tiny burrito"

  Scenario: Loop back to the top
    Given I have "tinytacoteam/zazu-fixture" as a plugin
    And the app is launched
    When I toggle it open
    And I type in "food tiny"
    And I hit the hotkey "control+n"
    And I hit the hotkey "control+n"
    And I hit the hotkey "control+n"
    And I hit the hotkey "control+n"
    Then the active result contains "tiny taco"

  Scenario: Loop to the bottom
    Given I have "tinytacoteam/zazu-fixture" as a plugin
    And the app is launched
    When I toggle it open
    And I type in "food tiny"
    And I hit the hotkey "control+p"
    Then the active result contains "tiny cookies"

  Scenario: Scroll up twice
    Given I have "tinytacoteam/zazu-fixture" as a plugin
    And the app is launched
    When I toggle it open
    And I type in "food tiny"
    And I hit the hotkey "control+p"
    And I hit the hotkey "control+p"
    Then the active result contains "tiny cookie cake"
