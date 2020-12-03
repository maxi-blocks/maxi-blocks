/**
 * WordPress dependencies
 */
const { render, useEffect, useState } = wp.element;
const { useSelect } = wp.data;

/**
 * Internal dependencies
 */
import stylesGenerator from '../../extensions/styles/stylesGenerator';

/**
 * Component
 */
const BlockStyles = () => {
	const { newStyles } = useSelect(() => {
		const newStyles = stylesGenerator();

		return {
			newStyles,
		};
	});

	const [styles, setStyles] = useState(newStyles);

	useEffect(() => setStyles(newStyles), [newStyles]);

	return <style id='testing-styles'>{styles}</style>;
};

if (document.body.classList.contains('maxi-blocks--active')) {
	const wrapper = document.createElement('div');
	wrapper.id = 'maxi-blocks__styles';

	document.head.appendChild(wrapper);

	render(<BlockStyles />, wrapper);
}
