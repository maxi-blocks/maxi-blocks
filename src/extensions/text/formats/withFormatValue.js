/**
 * WordPress dependencies
 */
const { createHigherOrderComponent, pure } = wp.compose;
const { useSelect } = wp.data;

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

			return <WrappedComponent formatValue={formatValue} {...props} />;
		}),
	'withFormatValue'
);

export default withFormatValue;
