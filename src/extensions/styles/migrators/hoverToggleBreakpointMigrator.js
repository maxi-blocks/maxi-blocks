import { getAttributeKey } from '@extensions/styles';

const NAME = 'Hover toggle breakpoint';

const HOVER_TOGGLE_KEYS = [
	'hover-preview',
	'hover-extension',
	'hover-border-status',
	'hover-padding-status',
	'hover-margin-status',
	'hover-title-typography-status',
	'hover-content-typography-status',
];

const isEligible = attributes =>
	HOVER_TOGGLE_KEYS.some(key => key in attributes);

const migrate = newAttributes => {
	HOVER_TOGGLE_KEYS.forEach(key => {
		if (Object.prototype.hasOwnProperty.call(newAttributes, key)) {
			const value = newAttributes[key];
			const destination = getAttributeKey(key, false, false, 'general');

			if (
				!Object.prototype.hasOwnProperty.call(
					newAttributes,
					destination
				)
			) {
				newAttributes[destination] = value;
			}

			delete newAttributes[key];
		}
	});

	return newAttributes;
};

export default { name: NAME, isEligible, migrate };
