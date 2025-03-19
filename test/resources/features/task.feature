Feature: Processamento de vídeos em fila

  Scenario: Iniciar o processamento de vídeos
    Given que o sistema está iniciado
    When a fila de vídeos é processada
    Then os vídeos são processados corretamente
