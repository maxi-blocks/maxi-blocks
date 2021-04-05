/**
 * WordPress dependencies
 */
import { createHigherOrderComponent, pure } from '@wordpress/compose';
import { useRef, useState, useEffect } from '@wordpress/element';
import { useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import getFormatValue from './getFormatValue';

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
					getFormatValue(
						formatElement,
						ref.current.blockRef.current
					)) ||
					{}
			);

			useEffect(() => {
				setFormatValue(
					(ref.current &&
						getFormatValue(
							formatElement,
							ref.current.blockRef.current
						)) ||
						{}
				);
			}, [selectionStart, selectionEnd]);

			return (
				<WrappedComponent
					ref={ref}
					formatValue={formatValue}
					{...props}
				/>
			);
		}),
	'withFormatValue'
);

export default withFormatValue;
