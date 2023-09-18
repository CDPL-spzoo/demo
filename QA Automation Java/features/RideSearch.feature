@chapter:component_tests
@user:type:admin
@host:test-env1
@scope:search @scope:all
Feature: Airport search

  Scenario: Make search for Berlin airport
    Given I do a GET request for path "/api/search/153fdst/airlines" with params:
      | key   | 9kjRqIW8hdwJJF6B7Uq |
      | query | Berlin             |
    Then I validate that Response code should be 200
    And I validate that Response size is greater than 0
    And I validate that Response param "name" contains "Air France"