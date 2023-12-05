import PSEUDO_ELEMENTS from './constants';

const getNormalAndHoverSelectors = ({ label, target }) => {
	const pseudoElement = PSEUDO_ELEMENTS.find(pseudo =>
		label.includes(pseudo)
	);
	const targetWithoutPseudoElement = target.replace(`::${pseudoElement}`, '');

	return {
		normal: {
			label,
			target,
		},
		hover: {
			label: `${label} on hover`,
			target: `${targetWithoutPseudoElement}:hover${
				pseudoElement ? `::${pseudoElement}` : ''
			}`,
		},
		...(targetWithoutPseudoElement !== '' && {
			'canvas hover': {
				label: `${label} on canvas hover`,
				target: `:hover ${targetWithoutPseudoElement.trim()}${
					pseudoElement ? `::${pseudoElement}` : ''
				}`,
			},
		}),
	};
};

export default getNormalAndHoverSelectors;
