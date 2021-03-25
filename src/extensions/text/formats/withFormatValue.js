/**
 * WordPress dependencies
 */
const { createHigherOrderComponent, pure } = wp.compose;
const { useRef, useState, useEffect } = wp.element;
const { useSelect } = wp.data;

/**
 * Internal dependencies
 */
import generateFormatValue from './generateFormatValue';

/**
 * Component
 */
const withFormatValue = createHigherOrderComponent(
	WrappedComponent =>
		pure(props => {
			const ref = useRef();
			const {
				attributes: { isList, typeOfList },
			} = props;

			const { selectionStart, selectionEnd } = useSelect(select => {
				const { getSelectionStart, getSelectionEnd } = select(
					'core/block-editor'
				);

				const selectionStart = getSelectionStart().offset;
				const selectionEnd = getSelectionEnd().offset;

				return {
					selectionStart,
					selectionEnd,
				};
			});

			const formatElement = {
				multilineTag: isList ? 'li' : undefined,
				multilineWrapperTags: isList ? typeOfList : undefined,
				__unstableIsEditableTree: true,
			};

			const [formatValue, setFormatValue] = useState(
				(ref.current &&
					generateFormatValue(
						formatElement,
						ref.current.blockRef.current
					)) ||
					{}
			);

			useEffect(() => {
				setFormatValue(
					(ref.current &&
						generateFormatValue(
							formatElement,
							ref.current.blockRef.current
						)) ||
						{}
				);
			}, [selectionStart, selectionEnd]);

			const getFormatValue = () => formatValue;

			return (
				<WrappedComponent
					ref={ref}
					getFormatValue={getFormatValue}
					{...props}
				/>
			);
		}),
	'withFormatValue'
);

export default withFormatValue;
