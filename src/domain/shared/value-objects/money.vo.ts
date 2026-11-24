import { InvalidValueError } from "../errors/domain.error";

const BRL_FORMATTER = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

/** Arredonda "meio para longe do zero": 1,5 → 2 e -1,5 → -2. */
function roundHalfAwayFromZero(value: number): number {
  return Math.sign(value) * Math.round(Math.abs(value));
}

/**
 * Valor monetário imutável, guardado como inteiro em centavos.
 * Todas as operações retornam uma nova instância.
 */
export class Money {
  private readonly cents: number;

  private constructor(cents: number) {
    if (!Number.isSafeInteger(cents)) {
      throw new InvalidValueError(
        "Valor monetário inválido: deve ser um inteiro em centavos, dentro do limite seguro.",
      );
    }
    this.cents = cents === 0 ? 0 : cents; // normaliza -0 para 0
    Object.freeze(this);
  }

  static fromCents(cents: number): Money {
    return new Money(cents);
  }

  /** Converte um valor em reais (ex.: 12.34) para centavos. */
  static fromDecimal(value: number): Money {
    if (!Number.isFinite(value)) {
      throw new InvalidValueError("Valor decimal inválido.");
    }
    // toPrecision(15) remove o ruído de ponto flutuante (1.005 * 100 = 100.49999999999999).
    const scaled = Number((value * 100).toPrecision(15));
    return new Money(roundHalfAwayFromZero(scaled));
  }

  static zero(): Money {
    return new Money(0);
  }

  static sum(values: readonly Money[]): Money {
    return values.reduce((total, current) => total.add(current), Money.zero());
  }

  add(other: Money): Money {
    return new Money(this.cents + other.cents);
  }

  subtract(other: Money): Money {
    return new Money(this.cents - other.cents);
  }

  /** Multiplica por um fator (ex.: 0.8 para 80%), arredondando para o centavo. */
  multiply(factor: number): Money {
    if (!Number.isFinite(factor)) {
      throw new InvalidValueError("Fator de multiplicação inválido.");
    }
    return new Money(roundHalfAwayFromZero(this.cents * factor));
  }

  isZero(): boolean {
    return this.cents === 0;
  }

  isPositive(): boolean {
    return this.cents > 0;
  }

  isNegative(): boolean {
    return this.cents < 0;
  }

  compareTo(other: Money): -1 | 0 | 1 {
    if (this.cents < other.cents) return -1;
    if (this.cents > other.cents) return 1;
    return 0;
  }

  equals(other: Money): boolean {
    return this.cents === other.cents;
  }

  isGreaterThan(other: Money): boolean {
    return this.cents > other.cents;
  }

  isGreaterThanOrEqualTo(other: Money): boolean {
    return this.cents >= other.cents;
  }

  isLessThan(other: Money): boolean {
    return this.cents < other.cents;
  }

  isLessThanOrEqualTo(other: Money): boolean {
    return this.cents <= other.cents;
  }

  toCents(): number {
    return this.cents;
  }

  toDecimal(): number {
    return this.cents / 100;
  }

  /** Ex.: "R$ 81.000,00". */
  toBRL(): string {
    return BRL_FORMATTER.format(this.toDecimal());
  }

  toString(): string {
    return this.toBRL();
  }
}