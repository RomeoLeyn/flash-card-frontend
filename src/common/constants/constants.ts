export enum LanguageCode {
  UK = "uk",
  EN = "en",
  DE = "de",
  FR = "fr",
  ES = "es",
  PL = "pl",
}

export const LANGUAGE_OPTIONS: { code: LanguageCode; label: string }[] = [
  { code: LanguageCode.UK, label: "Ukrainian" },
  { code: LanguageCode.EN, label: "English" },
  { code: LanguageCode.DE, label: "German" },
  { code: LanguageCode.FR, label: "French" },
  { code: LanguageCode.ES, label: "Spanish" },
  { code: LanguageCode.PL, label: "Polish" },
];

export enum SortOrder {
  ASC = "ASC",
  DESC = "DESC",
}

export enum CardSortBy {
  WORD = "word",
  CREATED_AT = "createdAt",
  NEXT_REVIEW_DATE = "nextReviewDate",
  LAST_REVIEWED_AT = "lastReviewedAt",
}

export const CARD_SORT_BY_OPTIONS: { value: CardSortBy; label: string }[] = [
  { value: CardSortBy.WORD, label: "Word (A-Z)" },
  { value: CardSortBy.CREATED_AT, label: "Date Created" },
  { value: CardSortBy.NEXT_REVIEW_DATE, label: "Next Review" },
  { value: CardSortBy.LAST_REVIEWED_AT, label: "Last Reviewed" },
];
