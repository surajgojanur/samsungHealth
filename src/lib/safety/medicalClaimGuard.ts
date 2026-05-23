const forbiddenPhrases = [
  "diagnosis",
  "disease",
  "you have",
  "heart problem",
  "emergency caused",
  "dangerous condition",
  "guaranteed",
  "proves"
];

const replacements: Array<[RegExp, string]> = [
  [/\bdiagnosis\b/gi, "doctor discussion"],
  [/\bdisease\b/gi, "health condition"],
  [/\byou have\b/gi, "your data shows"],
  [/\bheart problem\b/gi, "heart-related concern"],
  [/\bemergency caused\b/gi, "urgent event related to"],
  [/\bdangerous condition\b/gi, "concerning pattern"],
  [/\bguaranteed\b/gi, "not certain"],
  [/\bproves\b/gi, "suggests"]
];

export function findForbiddenMedicalClaims(text: string): string[] {
  const lower = text.toLowerCase();
  return forbiddenPhrases.filter((phrase) => lower.includes(phrase));
}

export function assertNoForbiddenMedicalClaims(text: string): void {
  const matches = findForbiddenMedicalClaims(text);
  if (matches.length) {
    throw new Error(`Forbidden medical wording found: ${matches.join(", ")}`);
  }
}

export function sanitizeGeneratedHealthText(text: string): string {
  return replacements.reduce((current, [pattern, replacement]) => current.replace(pattern, replacement), text);
}

