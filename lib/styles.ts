import { TransliterationStyle } from '@/types/transliteration';

export function getAllStyles() {
  return Object.values(TransliterationStyle);
}

export function buildPrompt(
  style: TransliterationStyle,
  reverse = false,
  customInstructions?: string
) {
  const direction = reverse
    ? 'You convert romanized text back to fully vocalized Arabic where possible (do not translate).'
    : 'You convert Arabic text to romanized Latin script (do not translate).';

  const base = `
You are an expert Arabic transliteration engine. ${direction}
- Follow the specified standard EXACTLY.
- Output ONLY the final result. No explanations, no quotes, no Markdown.
- Preserve word boundaries and punctuation.
- Do not add or remove content.
- Shadda: double the consonant.
- Definite article handling per standard; assimilate into sun letters where applicable.
- Tāʾ marbūṭah (ة): -ah in pause, -at in construct (context-sensitive) unless standard dictates otherwise.
`;

  let standard = '';
  switch (style) {
    case TransliterationStyle.IJMES:
      standard = `
Standard: IJMES (International Journal of Middle Eastern Studies).
- ʾ = hamzah (ء), ʿ = ʿayn (ع).
- Long vowels: ā, ī, ū.
- Emphatics: ṣ, ḍ, ṭ, ẓ; ḥ for ح; kh for خ; ġ for غ; q for ق; j for ج.
- Definite article: al-; assimilate with doubled initial sun letter (ash-shams, an-nūr, ar-rajul).
- Write tāʾ marbūṭah: -ah in pause, -at in construct.
`;
      break;
    case TransliterationStyle.ALA_LC:
      standard = `
Standard: ALA-LC (American Library Association - Library of Congress).
- ʾ = hamzah, ʿ = ʿayn.
- Long vowels: ā, ī, ū.
- Emphatics: ṣ, ḍ, ṭ, ẓ; ḥ for ح; ġ for غ; q for ق; j for ج.
- Definite article: al-; assimilate to sun letters with doubled consonant.
- Tāʾ marbūṭah: -ah in pause, -at in construct.
`;
      break;
    case TransliterationStyle.DIN_31635:
      standard = `
Standard: DIN 31635.
- ʾ = hamzah, ʿ = ʿayn.
- Long vowels: ā, ī, ū.
- Emphatics: ṣ, ḍ, ṭ, ẓ; ḥ for ح; ġ for غ; q for ق; j for ج.
- Definite article: al-; assimilate to sun letters with doubled consonant.
- Tāʾ marbūṭah: -a in pause, -at in construct.
`;
      break;
    case TransliterationStyle.BUCKWALTER:
      standard = `
Standard: Buckwalter (ASCII).
Deterministic character mapping:
- ء '  ا A  ب b  ت t  ث v  ج j  ح H  خ x
- د d  ذ *  ر r  ز z  س s  ش $  ص S  ض D  ط T  ظ Z
- ع E  غ g  ف f  ق q  ك k  ل l  م m  ن n  ه h  و w  ي y
- ة p  ى Y
- Short vowels: a i u ; tanwīn: F N K ; sukūn: o (if present); shadda: double consonant.
Definite article is not assimilated at mapping level; map per-character.
If reverse=true, invert mapping back to Arabic.
`;
      break;
    case TransliterationStyle.SHARIASOURCE:
      standard = `
Standard: SHARIAsource (Harvard).
- ʾ for hamzah, ʿ for ʿayn.
- Long vowels: ā, ī, ū; macrons retained.
- Emphatics: ṣ, ḍ, ṭ, ẓ; ḥ for ح; ġ for غ; q for ق; j for ج.
- Definite article: al-; assimilate to sun letters with doubled consonant; hyphenate clitics (e.g., wa’l-).
- Tāʾ marbūṭah: -ah in pause, -at in construct.
`;
      break;
    case TransliterationStyle.CUSTOM:
      standard = `
Standard: Custom simplified.
- ʾ hamzah, ʿ ʿayn; kh, sh, th, dh digraphs.
- Long vowels: aa, ii, uu (ASCII-friendly).
- Emphatics without dots: s, d, t, z; q for ق; j for ج.
- Definite article: al-; assimilate to sun letters (double consonant).
- Tāʾ marbūṭah: -a in pause, -at in construct.
`;
      break;
  }

  const custom = style === TransliterationStyle.CUSTOM && customInstructions
    ? `\nAdditional custom instructions (override where needed):\n${customInstructions}\n`
    : '';

  return `${base}\n${standard}\n${custom}`;
}
