import getTextDecorationStyles from '../getTextDecorationStyles';

describe('getTextDecorationStyles', () => {
	it('Should return styles for link when the whole text is a link', () => {
		const obj = {
			'is-whole-link-general': true,
			'text-decoration-general': 'underline',
		};

		const result = getTextDecorationStyles({ obj, isLink: true });

		expect(result).toMatchSnapshot();
	});

	it('Should not return styles for paragraph when the whole text is a link', () => {
		const obj = {
			'is-whole-link-general': true,
			'text-decoration-general': 'underline',
		};

		const result = getTextDecorationStyles({ obj });

		expect(result).toMatchSnapshot();
	});

	it('Should not return styles for link when the whole text is not a link', () => {
		const obj = {
			'is-whole-link-general': false,
			'text-decoration-general': 'underline',
		};

		const result = getTextDecorationStyles({ obj, isLink: true });

		expect(result).toMatchSnapshot();
	});
});
