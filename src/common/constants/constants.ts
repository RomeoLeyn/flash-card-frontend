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