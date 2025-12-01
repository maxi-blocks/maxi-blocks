/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

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
	__('Formal', 'maxi-blocks'),
	__('Friendly', 'maxi-blocks'),
	__('Emotional', 'maxi-blocks'),
	__('Analytical', 'maxi-blocks'),
	__('Creative', 'maxi-blocks'),
	__('Playful', 'maxi-blocks'),
	__('Encouraging', 'maxi-blocks'),
	__('Enthusiastic', 'maxi-blocks'),
	__('Calm', 'maxi-blocks'),
	__('Persuasive', 'maxi-blocks'),
	__('Dramatic', 'maxi-blocks'),
	__('Informative', 'maxi-blocks'),
	__('Collaborative', 'maxi-blocks'),
	__('Imaginative', 'maxi-blocks'),
	__('Inspirational', 'maxi-blocks'),
	__('Passionate', 'maxi-blocks'),
	__('Humorous', 'maxi-blocks'),
	__('Poetic', 'maxi-blocks'),
	__('Objective', 'maxi-blocks'),
	__('Celebratory', 'maxi-blocks'),
];

export const WRITING_STYLES = [
	__('Business', 'maxi-blocks'),
	__('Narrative', 'maxi-blocks'),
	__('Descriptive', 'maxi-blocks'),
	__('Expository Technical', 'maxi-blocks'),
	__('Academic', 'maxi-blocks'),
	__('Journalistic', 'maxi-blocks'),
	__('Creative', 'maxi-blocks'),
	__('Satirical', 'maxi-blocks'),
	__('Analytical Personal', 'maxi-blocks'),
	__('Reflective', 'maxi-blocks'),
	__('Historical', 'maxi-blocks'),
	__('Autobiographical', 'maxi-blocks'),
	__('Biographical', 'maxi-blocks'),
	__('Scientific', 'maxi-blocks'),
	__('Medical', 'maxi-blocks'),
	__('Legal', 'maxi-blocks'),
	__('Financial', 'maxi-blocks'),
	__('Instructional Educational', 'maxi-blocks'),
	__('Spiritual', 'maxi-blocks'),
	__('Gothic', 'maxi-blocks'),
	__('Romantic', 'maxi-blocks'),
	__('Surrealist', 'maxi-blocks'),
];

export const LANGUAGES = [
	__('Language of the prompt', 'maxi-blocks'),
	__('English (United Kingdom)', 'maxi-blocks'),
	__('Afrikaans', 'maxi-blocks'),
	__('Albanian - shqip', 'maxi-blocks'),
	__('Amharic - አማርኛ', 'maxi-blocks'),
	__('Arabic - العربية', 'maxi-blocks'),
	__('Aragonese - aragonés', 'maxi-blocks'),
	__('Armenian - հայերեն', 'maxi-blocks'),
	__('Asturian - asturianu', 'maxi-blocks'),
	__('Azerbaijani - azərbaycan dili', 'maxi-blocks'),
	__('Basque - euskara', 'maxi-blocks'),
	__('Belarusian - беларуская', 'maxi-blocks'),
	__('Bengali - বাংলা', 'maxi-blocks'),
	__('Bosnian - bosanski', 'maxi-blocks'),
	__('Breton - brezhoneg', 'maxi-blocks'),
	__('Bulgarian - български', 'maxi-blocks'),
	__('Catalan - català', 'maxi-blocks'),
	__('Central Kurdish - کوردی (دەستنوسی عەرەبی)', 'maxi-blocks'),
	__('Chinese - 中文', 'maxi-blocks'),
	__('Chinese (Hong Kong) - 中文（香港）', 'maxi-blocks'),
	__('Chinese (Simplified) - 中文（简体）', 'maxi-blocks'),
	__('Chinese (Traditional) - 中文（繁體）', 'maxi-blocks'),
	__('Corsican', 'maxi-blocks'),
	__('Croatian - hrvatski', 'maxi-blocks'),
	__('Czech - čeština', 'maxi-blocks'),
	__('Danish - dansk', 'maxi-blocks'),
	__('Dutch - Nederlands', 'maxi-blocks'),
	__('English', 'maxi-blocks'),
	__('English (Australia)', 'maxi-blocks'),
	__('English (Canada)', 'maxi-blocks'),
	__('English (India)', 'maxi-blocks'),
	__('English (New Zealand)', 'maxi-blocks'),
	__('English (South Africa)', 'maxi-blocks'),
	__('English (United States)', 'maxi-blocks'),
	__('Esperanto - esperanto', 'maxi-blocks'),
	__('Estonian - eesti', 'maxi-blocks'),
	__('Faroese - føroyskt', 'maxi-blocks'),
	__('Filipino', 'maxi-blocks'),
	__('Finnish - suomi', 'maxi-blocks'),
	__('French - français', 'maxi-blocks'),
	__('French (Canada) - français (Canada)', 'maxi-blocks'),
	__('French (France) - français (France)', 'maxi-blocks'),
	__('French (Switzerland) - français (Suisse)', 'maxi-blocks'),
	__('Galician - galego', 'maxi-blocks'),
	__('Georgian - ქართული', 'maxi-blocks'),
	__('German - Deutsch', 'maxi-blocks'),
	__('German (Austria) - Deutsch (Österreich)', 'maxi-blocks'),
	__('German (Germany) - Deutsch (Deutschland)', 'maxi-blocks'),
	__('German (Liechtenstein) - Deutsch (Liechtenstein)', 'maxi-blocks'),
	__('German (Switzerland) - Deutsch (Schweiz)', 'maxi-blocks'),
	__('Greek - Ελληνικά', 'maxi-blocks'),
	__('Guarani', 'maxi-blocks'),
	__('Gujarati - ગુજરાતી', 'maxi-blocks'),
	__('Hausa', 'maxi-blocks'),
	__('Hawaiian - ʻŌlelo Hawaiʻi', 'maxi-blocks'),
	__('Hebrew - עברית', 'maxi-blocks'),
	__('Hindi - हिन्दी', 'maxi-blocks'),
	__('Hungarian - magyar', 'maxi-blocks'),
	__('Icelandic - íslenska', 'maxi-blocks'),
	__('Indonesian - Indonesia', 'maxi-blocks'),
	__('Interlingua', 'maxi-blocks'),
	__('Irish - Gaeilge', 'maxi-blocks'),
	__('Italian - italiano', 'maxi-blocks'),
	__('Italian (Italy) - italiano (Italia)', 'maxi-blocks'),
	__('Italian (Switzerland) - italiano (Svizzera)', 'maxi-blocks'),
	__('Japanese - 日本語', 'maxi-blocks'),
	__('Kannada - ಕನ್ನಡ', 'maxi-blocks'),
	__('Kazakh - қазақ тілі', 'maxi-blocks'),
	__('Khmer - ខ្មែរ', 'maxi-blocks'),
	__('Korean - 한국어', 'maxi-blocks'),
	__('Kurdish - Kurdî', 'maxi-blocks'),
	__('Kyrgyz - кыргызча', 'maxi-blocks'),
	__('Lao - ລາວ', 'maxi-blocks'),
	__('Latin', 'maxi-blocks'),
	__('Latvian - latviešu', 'maxi-blocks'),
	__('Lingala - lingála', 'maxi-blocks'),
	__('Lithuanian - lietuvių', 'maxi-blocks'),
	__('Macedonian - македонски', 'maxi-blocks'),
	__('Malay - Bahasa Melayu', 'maxi-blocks'),
	__('Malayalam - മലയാളം', 'maxi-blocks'),
	__('Maltese - Malti', 'maxi-blocks'),
	__('Marathi - मराठी', 'maxi-blocks'),
	__('Mongolian - монгол', 'maxi-blocks'),
	__('Nepali - नेपाली', 'maxi-blocks'),
	__('Norwegian - norsk', 'maxi-blocks'),
	__('Norwegian Bokmål - norsk bokmål', 'maxi-blocks'),
	__('Norwegian Nynorsk - nynorsk', 'maxi-blocks'),
	__('Occitan', 'maxi-blocks'),
	__('Oriya - ଓଡ଼ିଆ', 'maxi-blocks'),
	__('Oromo - Oromoo', 'maxi-blocks'),
	__('Pashto - پښتو', 'maxi-blocks'),
	__('Persian - فارسی', 'maxi-blocks'),
	__('Polish - polski', 'maxi-blocks'),
	__('Portuguese - português', 'maxi-blocks'),
	__('Portuguese (Brazil) - português (Brasil)', 'maxi-blocks'),
	__('Portuguese (Portugal) - português (Portugal)', 'maxi-blocks'),
	__('Punjabi - ਪੰਜਾਬੀ', 'maxi-blocks'),
	__('Quechua', 'maxi-blocks'),
	__('Romanian - română', 'maxi-blocks'),
	__('Romanian (Moldova) - română (Moldova)', 'maxi-blocks'),
	__('Romansh - rumantsch', 'maxi-blocks'),
	__('Russian - русский', 'maxi-blocks'),
	__('Scottish Gaelic', 'maxi-blocks'),
	__('Serbian - српски', 'maxi-blocks'),
	__('Serbo - Croatian', 'maxi-blocks'),
	__('Shona - chiShona', 'maxi-blocks'),
	__('Sindhi', 'maxi-blocks'),
	__('Sinhala - සිංහල', 'maxi-blocks'),
	__('Slovak - slovenčina', 'maxi-blocks'),
	__('Slovenian - slovenščina', 'maxi-blocks'),
	__('Somali - Soomaali', 'maxi-blocks'),
	__('Southern Sotho', 'maxi-blocks'),
	__('Spanish - español', 'maxi-blocks'),
	__('Spanish (Argentina) - español (Argentina)', 'maxi-blocks'),
	__('Spanish (Latin America) - español (Latinoamérica)', 'maxi-blocks'),
	__('Spanish (Mexico) - español (México)', 'maxi-blocks'),
	__('Spanish (Spain) - español (España)', 'maxi-blocks'),
	__('Spanish (United States) - español (Estados Unidos)', 'maxi-blocks'),
	__('Sundanese', 'maxi-blocks'),
	__('Swahili - Kiswahili', 'maxi-blocks'),
	__('Swedish - svenska', 'maxi-blocks'),
	__('Tajik - тоҷикӣ', 'maxi-blocks'),
	__('Tamil - தமிழ்', 'maxi-blocks'),
	__('Tigrinya - ትግርኛ', 'maxi-blocks'),
	__('Tongan - lea fakatonga', 'maxi-blocks'),
	__('Turkish - Türkçe', 'maxi-blocks'),
	__('Turkmen', 'maxi-blocks'),
	__('Twi', 'maxi-blocks'),
	__('Ukrainian - українська', 'maxi-blocks'),
	__('Urdu - اردو', 'maxi-blocks'),
	__('Uyghur', 'maxi-blocks'),
	__('Uzbek - o‘zbek', 'maxi-blocks'),
	__('Vietnamese - Tiếng Việt', 'maxi-blocks'),
	__('Walloon - wa', 'maxi-blocks'),
	__('Welsh - Cymraeg', 'maxi-blocks'),
	__('Western Frisian', 'maxi-blocks'),
	__('Xhosa', 'maxi-blocks'),
	__('Yiddish', 'maxi-blocks'),
	__('Yoruba - Èdè Yorùbá', 'maxi-blocks'),
	__('Zulu - isiZulu', 'maxi-blocks'),
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
	false: __('No context', 'maxi-blocks'),
	container: __('This container', 'maxi-blocks'),
	page: __('This page', 'maxi-blocks'),
};

export const CONTENT_LIMIT = 100;
