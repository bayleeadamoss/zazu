Feature: Open
  As a user of Zazu
  I want to open the app
  So I can be more productive

  Scenario: Searching
    When I open the application
    And I type in "tinytacoteam"
    Then the search window is eventually visible
    And the results should be visible
    And the results should contain "tinytacoteam"

  Scenario: Action Results
    When I open the application
    And I type in "pryjs"
    And I eventually click on the active result
    Then the search window is not visible
    And my clipboard contains "pryjs"
