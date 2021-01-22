Feature: Batch

  Scenario: sending batch
    Given Alice account with balance 1.5 ETH
    When Alice adds execute random account transaction to batch
    When Alice estimates batch
    When Alice submits batch
    Then Alice batch should be empty
