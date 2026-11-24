/**
 * Base de todos os erros de negócio. As camadas externas tratam um
 * `DomainError` (previsível, com mensagem segura para o usuário) de forma
 * diferente de uma falha inesperada.
 */
export abstract class DomainError extends Error {
  abstract readonly code: string;

  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

/** Um valor viola o invariante de um Value Object ou de uma Entidade. */
export class InvalidValueError extends DomainError {
  readonly code = "INVALID_VALUE";
}