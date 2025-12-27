/**
 * Lightweight Lorem Ipsum generator
 * Replaces the heavy react-lorem-ipsum package (~408 KB -> ~1 KB)
 */

// Standard Lorem Ipsum words pool
const LOREM_WORDS = [
	'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
	'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
	'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
	'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
	'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
	'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
	'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
	'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum', 'at', 'vero', 'eos',
	'accusamus', 'iusto', 'odio', 'dignissimos', 'ducimus', 'blanditiis',
	'praesentium', 'voluptatum', 'deleniti', 'atque', 'corrupti', 'quos', 'dolores',
	'quas', 'molestias', 'excepturi', 'obcaecati', 'cupiditate', 'provident',
	'similique', 'mollitia', 'animi', 'perspiciatis', 'unde', 'omnis', 'iste',
	'natus', 'error', 'voluptatem', 'accusantium', 'doloremque', 'laudantium',
	'totam', 'rem', 'aperiam', 'eaque', 'ipsa', 'quae', 'ab', 'illo', 'inventore',
	'veritatis', 'quasi', 'architecto', 'beatae', 'vitae', 'dicta', 'explicabo',
];

/**
 * Get a random word from the Lorem Ipsum pool
 */
const getRandomWord = () =>
	LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)];

/**
 * Generate a sentence with the specified number of words
 * @param {number} wordCount - Number of words in the sentence
 * @returns {string} A Lorem Ipsum sentence
 */
const generateSentence = wordCount => {
	const words = Array.from({ length: wordCount }, getRandomWord);
	// Capitalize first letter
	words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
	return `${words.join(' ')}.`;
};

/**
 * Generate a paragraph with the specified parameters
 * @param {Object} options - Generation options
 * @param {number} options.avgWordsPerSentence - Average words per sentence (default: 10)
 * @param {number} options.avgSentencesPerParagraph - Number of sentences (default: 5)
 * @returns {string} A Lorem Ipsum paragraph
 */
export const generateLoremIpsum = ({
	avgWordsPerSentence = 10,
	avgSentencesPerParagraph = 5,
} = {}) => {
	const sentences = [];

	for (let i = 0; i < avgSentencesPerParagraph; i += 1) {
		// Add some variance to word count (+/- 30%)
		const variance = Math.floor(avgWordsPerSentence * 0.3);
		const wordCount =
			avgWordsPerSentence +
			Math.floor(Math.random() * variance * 2) -
			variance;
		sentences.push(generateSentence(Math.max(3, wordCount)));
	}

	return sentences.join(' ');
};

export default generateLoremIpsum;
