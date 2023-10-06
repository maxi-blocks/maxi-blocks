export const CONTENT_TYPES_DATA = {
	Headline: {
		description:
			'Create a compelling and concise headline that captures the main theme.',
		examples: [
			'Improve your front-end skills by building real projects',
			'Turn followers into customers',
			'The simplest way to create forms',
			"It's how you make podcasts",
			"One click. No passwords. The world's fastest checkout.",
			'Ace the SAT test with just 10 minutes of studying every day',
			"You don't have to be an SEO to rank higher in Google",
			'The all-in-one toolkit for working remotely',
		],
		defaultCharacterCountGuideline: 60, // Typically headlines are short and to the point.
	},
	Subheading: {
		description:
			'Provide a descriptive subheading that supports the main headline.',
		examples: [
			'Key Features and benefits',
			'Calming teas that help you relax, unwind, and drift into deep, restorative sleep',
			'10-min micro lessons designed to boost confidence and make SAT strategies easy to remember',
			'The best online course platform for creating, selling, and promoting your online courses. Start monetizing your skills, experiences, and your audience.',
			'Create scholarships and grants for the people and causes you care most about',
		],
		defaultCharacterCountGuideline: 100, // Slightly longer than a headline.
	},
	'Body text': {
		description:
			'Write informative and engaging body text that elaborates on the main topic.',
		defaultCharacterCountGuideline: 500, // Arbitrary number. This could be much longer depending on context.
	},
	Quotes: {
		description:
			'Include relevant quotes that add authority or perspective. Ensure proper attribution.',
		examples: [
			'"The only way to do great work is to love what you do." - Steve Jobs',
		],
		defaultCharacterCountGuideline: 200, // A typical length for a direct quote.
	},
	'Pull quotes Testimonial': {
		description:
			'Craft testimonials or pull quotes that highlight key messages or endorsements.',
		examples: [
			'"This product exceeded my expectations. I can\'t imagine my life without it." - Jane Doe',
			'"I highly recommend this service. It has made a significant impact on my business." - John Smith',
			'"The customer support team is amazing. They went above and beyond to help me." - Emily Johnson',
			'"I\'m so grateful for this product. It has improved my daily routine in so many ways." - Sarah Thompson',
			'"This is the best solution I\'ve found. It has saved me time and effort." - Michael Brown',
			'"I\'ve achieved great results with this product. It\'s a game-changer." - Jessica Davis',
			'"I\'m impressed by the quality and performance of this product. It\'s outstanding." - David Wilson',
			'"I\'ve seen a significant improvement since using this service. It\'s worth every penny." - Jennifer Anderson',
			'"I\'m a satisfied customer. This product has exceeded my expectations." - Robert Martinez',
			'"I\'ve recommended this product to all my friends. It\'s truly remarkable." - Amanda Taylor',
		],
		defaultCharacterCountGuideline: 150, // Testimonials might be a bit concise but highlighted.
	},
	'Calls-to-action (CTA)': {
		description:
			'Design persuasive calls-to-action that prompt the reader to take a specific step.',
		examples: ['Click Here to Learn More!'],
		defaultCharacterCountGuideline: 25, // CTAs are usually very short and action-oriented.
	},
	'Alt tag': {
		description:
			'Create descriptive alt tags for images that accurately represent the visual content.',
		examples: ['Logo of Our Company'],
		defaultCharacterCountGuideline: 125, // Descriptive, but not too long, for accessibility.
	},
	'Image Caption': {
		description:
			'Provide captions for images that help to contextualize the image for the viewer.',
		examples: [
			'Image of the main office building',
			'A team meeting in progress',
			'CEO Jane Doe receiving an award',
		],
		defaultCharacterCountGuideline: 100, // Typically short descriptions for images.
	},
	'Page Titles': {
		description:
			'Craft titles for web pages that are descriptive and optimized for search engines.',
		examples: [
			'Home - My Company',
			'About Us - Learn More About Our Team',
			'Products - Browse Our Selection',
		],
		defaultCharacterCountGuideline: 60, // SEO-friendly length.
	},
	FAQs: {
		description:
			'Write answers to frequently asked questions that are clear and to the point.',
		examples: [
			'Yes, we offer free shipping on orders over $50.',
			'Our customer service team is available 24/7.',
			'We accept all major credit cards and PayPal.',
		],
		defaultCharacterCountGuideline: 200, // Enough to answer the question but not too long.
	},
	'Product descriptions': {
		description:
			'Write clear and appealing product descriptions that highlight key features and benefits.',
		examples: [
			'Sleek and modern, this chair offers both style and comfort...',
		],
		defaultCharacterCountGuideline: 300, // Might vary a lot, but a general estimate for a concise product description.
	},
};

export const CONTENT_TYPES = Object.keys(CONTENT_TYPES_DATA);

export const CONTENT_TYPE_DESCRIPTIONS = Object.fromEntries(
	CONTENT_TYPES.map(contentType => [
		contentType,
		CONTENT_TYPES_DATA[contentType].description,
	])
);

export const CONTENT_TYPE_EXAMPLES = Object.fromEntries(
	CONTENT_TYPES.map(contentType => [
		contentType,
		CONTENT_TYPES_DATA[contentType].examples,
	])
);

export const DEFAULT_CHARACTER_COUNT_GUIDELINES = Object.fromEntries(
	CONTENT_TYPES.map(contentType => [
		contentType,
		CONTENT_TYPES_DATA[contentType].defaultCharacterCountGuideline,
	])
);

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
	'Language of the prompt',
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

export const MODIFY_OPTIONS_DATA = {
	rephrase: {
		action: 'rephrasing',
		modificator: 'rephrased',
	},
	shorten: {
		action: 'shortening',
		modificator: 'shortened',
	},
	lengthen: {
		action: 'lengthening',
		modificator: 'lengthened',
	},
	'fix spelling & grammar': {
		action: 'fixing spelling & grammar',
		modificator: 'fixed spelling & grammar',
	},
	translate: {
		action: 'translating',
		modificator: 'translated',
	},
	custom: {
		action: 'modifying',
	},
};

export const MODIFY_OPTIONS = Object.keys(MODIFY_OPTIONS_DATA);

export const MODIFICATION_ACTIONS = Object.fromEntries(
	MODIFY_OPTIONS.map(modifyOption => [
		modifyOption,
		MODIFY_OPTIONS_DATA[modifyOption].action,
	])
);

export const MODIFICATION_MODIFICATORS = Object.fromEntries(
	MODIFY_OPTIONS.map(modifyOption => [
		modifyOption,
		MODIFY_OPTIONS_DATA[modifyOption].modificator,
	])
);

export const DEFAULT_TEMPERATURE = 0.75;

export const LOAD_MORE_COUNT = 5;

export const CONTEXT_OPTIONS = {
	false: 'No context',
	container: 'This container',
	page: 'This page',
};

export const CONTENT_LIMIT = 100;
