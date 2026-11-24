import { InvalidValueError } from "../errors/domain.error";

const MIN_YEAR = 1900;
const MAX_YEAR = 9999;

/** Período de competência (mês/ano), imutável. O mês vai de 1 a 12. */
export class CompetencePeriod {
  private readonly _month: number;
  private readonly _year: number;

  private constructor(month: number, year: number) {
    if (!Number.isInteger(month) || month < 1 || month > 12) {
      throw new InvalidValueError("Mês de competência inválido: use um valor de 1 a 12.");
    }
    if (!Number.isInteger(year) || year < MIN_YEAR || year > MAX_YEAR) {
      throw new InvalidValueError(
        `Ano de competência inválido: use um valor entre ${MIN_YEAR} e ${MAX_YEAR}.`,
      );
    }
    this._month = month;
    this._year = year;
    Object.freeze(this);
  }

  static of(month: number, year: number): CompetencePeriod {
    return new CompetencePeriod(month, year);
  }

  /** Usa o mês e o ano no fuso horário local da data recebida. */
  static fromDate(date: Date): CompetencePeriod {
    if (Number.isNaN(date.getTime())) {
      throw new InvalidValueError("Data inválida.");
    }
    return new CompetencePeriod(date.getMonth() + 1, date.getFullYear());
  }

  /** Os 12 períodos de um ano, de janeiro a dezembro (base do grid de guias DAS). */
  static allOfYear(year: number): readonly CompetencePeriod[] {
    return Array.from({ length: 12 }, (_, index) => new CompetencePeriod(index + 1, year));
  }

  get month(): number {
    return this._month;
  }

  get year(): number {
    return this._year;
  }

  next(): CompetencePeriod {
    return this._month === 12
      ? new CompetencePeriod(1, this._year + 1)
      : new CompetencePeriod(this._month + 1, this._year);
  }

  previous(): CompetencePeriod {
    return this._month === 1
      ? new CompetencePeriod(12, this._year - 1)
      : new CompetencePeriod(this._month - 1, this._year);
  }

  compareTo(other: CompetencePeriod): -1 | 0 | 1 {
    const current = this._year * 12 + this._month;
    const target = other._year * 12 + other._month;
    if (current < target) return -1;
    if (current > target) return 1;
    return 0;
  }

  equals(other: CompetencePeriod): boolean {
    return this._month === other._month && this._year === other._year;
  }

  /** Ex.: "11/2026". */
  toString(): string {
    return `${String(this._month).padStart(2, "0")}/${this._year}`;
  }
}