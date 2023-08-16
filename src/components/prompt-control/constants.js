export const CONTENT_TYPES = [
	'Headline',
	'Subheading',
	'Body text',
	'Quotes',
	'Pull quotes Testimonial',
	'Calls-to-action (CTA)',
	'Alt tag',
	'Image caption Page titles FAQs',
	'Product descriptions',
];

export const CONTENT_TYPE_DESCRIPTIONS = {
	Headline:
		'Create a compelling and concise headline that captures the main theme.',
	Subheading:
		'Provide a descriptive subheading that supports the main headline.',
	'Body text':
		'Write informative and engaging body text that elaborates on the main topic.',
	Quotes: 'Include relevant quotes that add authority or perspective. Ensure proper attribution.',
	'Pull quotes Testimonial':
		'Craft testimonials or pull quotes that highlight key messages or endorsements.',
	'Calls-to-action (CTA)':
		'Design persuasive calls-to-action that prompt the reader to take a specific step.',
	'Alt tag':
		'Create descriptive alt tags for images that accurately represent the visual content.',
	'Image caption Page titles FAQs':
		'Provide captions for images, titles for pages, or answers to frequently asked questions.',
	'Product descriptions':
		'Write clear and appealing product descriptions that highlight key features and benefits.',
};

export const DEFAULT_CHARACTER_COUNT_GUIDELINES = {
	Headline: 50, // Typically headlines are short and to the point.
	Subheading: 100, // Slightly longer than a headline.
	'Body text': 500, // Arbitrary number. This could be much longer depending on context.
	Quotes: 200, // A typical length for a direct quote.
	'Pull quotes Testimonial': 150, // Testimonials might be a bit concise but highlighted.
	'Calls-to-action (CTA)': 25, // CTAs are usually very short and action-oriented.
	'Alt tag': 125, // Descriptive, but not too long, for accessibility.
	'Image caption Page titles FAQs': 100, // Typically short descriptions or titles.
	'Product descriptions': 300, // Might vary a lot, but a general estimate for a concise product description.
};

export const TONES = [
	'Formal',
	'Friendly',
	'Emotional',
	'Analytical',
	'Creative',
	'Playful',
	'Encouraging',
	'Enthusiastic',
	'Calm',
	'Persuasive',
	'Dramatic',
	'Informative',
	'Collaborative',
	'Imaginative',
	'Inspirational',
	'Passionate',
	'Humorous',
	'Poetic',
	'Objective',
	'Celebratory',
];

export const WRITING_STYLES = [
	'Business',
	'Narrative',
	'Descriptive',
	'Expository Technical',
	'Academic',
	'Journalistic',
	'Creative',
	'Satirical',
	'Analytical Personal',
	'Reflective',
	'Historical',
	'Autobiographical',
	'Biographical',
	'Scientific',
	'Medical',
	'Legal',
	'Financial',
	'Instructional Educational',
	'Inspirational',
	'Spiritual',
	'Gothic',
	'Romantic',
	'Surrealist',
];

export const LANGUAGES = [
	'English (United Kingdom)',
	'Afrikaans',
	'Albanian - shqip',
	'Amharic - አማርኛ',
	'Arabic - العربية',
	'Aragonese - aragonés',
	'Armenian - հայերեն',
	'Asturian - asturianu',
	'Azerbaijani - azərbaycan dili',
	'Basque - euskara',
	'Belarusian - беларуская',
	'Bengali - বাংলা',
	'Bosnian - bosanski',
	'Breton - brezhoneg',
	'Bulgarian - български',
	'Catalan - català',
	'Central Kurdish - کوردی (دەستنوسی عەرەبی)',
	'Chinese - 中文',
	'Chinese (Hong Kong) - 中文（香港）',
	'Chinese (Simplified) - 中文（简体）',
	'Chinese (Traditional) - 中文（繁體）',
	'Corsican',
	'Croatian - hrvatski',
	'Czech - čeština',
	'Danish - dansk',
	'Dutch - Nederlands',
	'English',
	'English (Australia)',
	'English (Canada)',
	'English (India)',
	'English (New Zealand)',
	'English (South Africa)',
	'English (United States)',
	'Esperanto - esperanto',
	'Estonian - eesti',
	'Faroese - føroyskt',
	'Filipino',
	'Finnish - suomi',
	'French - français',
	'French (Canada) - français (Canada)',
	'French (France) - français (France)',
	'French (Switzerland) - français (Suisse)',
	'Galician - galego',
	'Georgian - ქართული',
	'German - Deutsch',
	'German (Austria) - Deutsch (Österreich)',
	'German (Germany) - Deutsch (Deutschland)',
	'German (Liechtenstein) - Deutsch (Liechtenstein)',
	'German (Switzerland) - Deutsch (Schweiz)',
	'Greek - Ελληνικά',
	'Guarani',
	'Gujarati - ગુજરાતી',
	'Hausa',
	'Hawaiian - ʻŌlelo Hawaiʻi',
	'Hebrew - עברית',
	'Hindi - हिन्दी',
	'Hungarian - magyar',
	'Icelandic - íslenska',
	'Indonesian - Indonesia',
	'Interlingua',
	'Irish - Gaeilge',
	'Italian - italiano',
	'Italian (Italy) - italiano (Italia)',
	'Italian (Switzerland) - italiano (Svizzera)',
	'Japanese - 日本語',
	'Kannada - ಕನ್ನಡ',
	'Kazakh - қазақ тілі',
	'Khmer - ខ្មែរ',
	'Korean - 한국어',
	'Kurdish - Kurdî',
	'Kyrgyz - кыргызча',
	'Lao - ລາວ',
	'Latin',
	'Latvian - latviešu',
	'Lingala - lingála',
	'Lithuanian - lietuvių',
	'Macedonian - македонски',
	'Malay - Bahasa Melayu',
	'Malayalam - മലയാളം',
	'Maltese - Malti',
	'Marathi - मराठी',
	'Mongolian - монгол',
	'Nepali - नेपाली',
	'Norwegian - norsk',
	'Norwegian Bokmål - norsk bokmål',
	'Norwegian Nynorsk - nynorsk',
	'Occitan',
	'Oriya - ଓଡ଼ିଆ',
	'Oromo - Oromoo',
	'Pashto - پښتو',
	'Persian - فارسی',
	'Polish - polski',
	'Portuguese - português',
	'Portuguese (Brazil) - português (Brasil)',
	'Portuguese (Portugal) - português (Portugal)',
	'Punjabi - ਪੰਜਾਬੀ',
	'Quechua',
	'Romanian - română',
	'Romanian (Moldova) - română (Moldova)',
	'Romansh - rumantsch',
	'Russian - русский',
	'Scottish Gaelic',
	'Serbian - српски',
	'Serbo - Croatian',
	'Shona - chiShona',
	'Sindhi',
	'Sinhala - සිංහල',
	'Slovak - slovenčina',
	'Slovenian - slovenščina',
	'Somali - Soomaali',
	'Southern Sotho',
	'Spanish - español',
	'Spanish (Argentina) - español (Argentina)',
	'Spanish (Latin America) - español (Latinoamérica)',
	'Spanish (Mexico) - español (México)',
	'Spanish (Spain) - español (España)',
	'Spanish (United States) - español (Estados Unidos)',
	'Sundanese',
	'Swahili - Kiswahili',
	'Swedish - svenska',
	'Tajik - тоҷикӣ',
	'Tamil - தமிழ்',
	'Tatar',
	'Telugu - తెలుగు',
	'Thai - ไทย',
	'Tigrinya - ትግርኛ',
	'Tongan - lea fakatonga',
	'Turkish - Türkçe',
	'Turkmen',
	'Twi',
	'Ukrainian - українська',
	'Urdu - اردو',
	'Uyghur',
	'Uzbek - o‘zbek',
	'Vietnamese - Tiếng Việt',
	'Walloon - wa',
	'Welsh - Cymraeg',
	'Western Frisian',
	'Xhosa',
	'Yiddish',
	'Yoruba - Èdè Yorùbá',
	'Zulu - isiZulu',
];

export const MODIFY_OPTIONS = ['rephrase', 'shorten', 'lengthen', 'custom'];

export const DEFAULT_CONFIDENCE_LEVEL = 75;
