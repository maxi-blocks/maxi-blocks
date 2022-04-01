/**
 * WordPress dependencies
 */
import { createHigherOrderComponent, pure } from '@wordpress/compose';
import { useSelect } from '@wordpress/data';

/**
 * Component
 */
const withFormatValue = createHigherOrderComponent(
	WrappedComponent =>
		pure(props => {
			const { formatValue } = useSelect(select => {
				const { getFormatValue } = select('maxiBlocks/text');

				const formatValue = getFormatValue();

				return { formatValue };
			});

			console.log(formatValue);

			return <WrappedComponent formatValue={formatValue} {...props} />;
		}),
	'withFormatValue'
);

export default withFormatValue;
