/**
 * WordPress dependencies
 */
const { Button } = wp.components;
const { RawHTML } = wp.element;

/**
 * External dependencies
 */
import classnames from 'classnames';
import DOMPurify from 'dompurify';

/**
 * Component
 */
const SVGButton = props => {
	const { content, onClick, className } = props;

	const classes = classnames('maxi-svg-button', className);

	const cleanedContent = DOMPurify.sanitize(content);

	return (
		<Button
			className={classes}
			onClick={() =>
				onClick(
					document
						.createRange()
						.createContextualFragment(cleanedContent)
						.firstElementChild
				)
			}
		>
			<RawHTML>{cleanedContent}</RawHTML>
		</Button>
	);
};

export default SVGButton;
