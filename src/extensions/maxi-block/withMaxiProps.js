import { select } from '@wordpress/data';
import { createHigherOrderComponent, pure } from '@wordpress/compose';

const withMaxiProps = createHigherOrderComponent(
	WrappedComponent =>
		pure(ownProps => {
			const { setAttributes } = ownProps;

			const handleSetAttributes = obj => {
				const response = { ...obj };

				Object.entries(obj).forEach(([key, value]) => {
					const winBreakpoint =
						select('maxiBlocks').receiveWinBreakpoint();

					if (
						key.includes('-general') &&
						!Object.keys(obj).includes(
							key.replace('-general', `-${winBreakpoint}`)
						)
					) {
						const newKey = key.replace(
							'-general',
							`-${winBreakpoint}`
						);

						response[newKey] = value;
					}
				});

				setAttributes(response);
			};

			return (
				<WrappedComponent
					{...ownProps}
					handleSetAttributes={handleSetAttributes}
				/>
			);
		}),
	'withMaxiProps'
);

export default withMaxiProps;
