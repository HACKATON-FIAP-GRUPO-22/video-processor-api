Feature: Processamento de vídeos em fila
  Como um sistema de processamento de vídeos
  Eu quero executar a fila de processamento
  Para que os vídeos sejam processados corretamente

  Scenario: Iniciar o processamento de vídeos
    Given que o sistema está iniciado
    When a fila de vídeos é processada
    Then os vídeos são processados corretamente
