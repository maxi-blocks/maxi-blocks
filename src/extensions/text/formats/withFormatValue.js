/**
 * WordPress dependencies
 */
const { createHigherOrderComponent } = wp.compose;
const { useRef } = wp.element;

/**
 * Internal dependencies
 */
import getFormatValue from './getFormatValue';

/**
 * Component
 */
export default createHigherOrderComponent(
	TextMaxiComponent => props => {
		const ref = useRef();
		const {
			attributes: { isList, typeOfList },
		} = props;

		const formatElement = {
			multilineTag: isList ? 'li' : undefined,
			multilineWrapperTags: isList ? typeOfList : undefined,
			__unstableIsEditableTree: true,
		};
		const formatValue =
			(ref.current &&
				getFormatValue(formatElement, ref.current.textRef.current)) ||
			{};

		return (
			<TextMaxiComponent ref={ref} formatValue={formatValue} {...props} />
		);
	},
	'withFormatValue'
);
