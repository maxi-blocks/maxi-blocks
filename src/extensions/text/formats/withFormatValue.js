/**
 * WordPress dependencies
 */
const { createHigherOrderComponent, pure } = wp.compose;
const { useRef } = wp.element;

/**
 * Component
 */
const withFormatValue = createHigherOrderComponent(
	WrappedComponent =>
		pure(props => {
			const formatValue = useRef({});

			const getFormatValue = () => formatValue.current;
			const setFormatValue = newFormatValue => {
				formatValue.current = newFormatValue;
			};

			return (
				<WrappedComponent
					getFormatValue={getFormatValue}
					setFormatValue={setFormatValue}
					{...props}
				/>
			);
		}),
	'withFormatValue'
);

export default withFormatValue;
