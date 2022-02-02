import { select } from '@wordpress/data';
import { createHigherOrderComponent, pure } from '@wordpress/compose';
import getBreakpointFromAttribute from '../styles/getBreakpointFromAttribute';
import { getDefaultAttribute, getIsValid } from '../styles';

import { isNil } from 'lodash';

const breakpoints = ['xxl', 'xl', 'l', 'm', 's', 'xs'];

const withMaxiProps = createHigherOrderComponent(
	WrappedComponent =>
		pure(ownProps => {
			const { setAttributes, attributes, clientId } = ownProps;

			const handleSetAttributes = obj => {
				const response = { ...obj };

				const winBreakpoint =
					select('maxiBlocks').receiveWinBreakpoint();

				Object.entries(obj).forEach(([key, value]) => {
					const breakpoint = getBreakpointFromAttribute(key);

					const isHigherBreakpoint =
						breakpoints.indexOf(breakpoint) <
						breakpoints.indexOf(winBreakpoint);

					if (!isHigherBreakpoint) return;

					const attrLabelOnWinBreakpoint = `${key.slice(
						0,
						key.lastIndexOf('-')
					)}-${winBreakpoint}`;
					const attrExistOnWinBreakpoint = getIsValid(
						attributes[attrLabelOnWinBreakpoint],
						true
					);

					if (attrExistOnWinBreakpoint && breakpoint !== 'general')
						return;

					const attrLabelOnGeneral = `${key.slice(
						0,
						key.lastIndexOf('-')
					)}-general`;
					const attrExistOnGeneral = getIsValid(
						attributes[attrLabelOnGeneral],
						true
					);

					if (!attrExistOnGeneral && breakpoint === 'xxl')
						response[attrLabelOnGeneral] = value;

					const existHigherBreakpointAttribute = breakpoints
						.slice(0, breakpoints.indexOf(winBreakpoint))
						.some(
							breakpoint =>
								!isNil(
									attributes[
										`${key.slice(
											0,
											key.lastIndexOf('-')
										)}-${breakpoint}`
									]
								)
						);

					if (
						!attrExistOnGeneral &&
						!attrExistOnWinBreakpoint &&
						breakpoint === 'general' &&
						existHigherBreakpointAttribute
					)
						response[attrLabelOnWinBreakpoint] = value;

					if (!attrExistOnGeneral) return;

					const defaultGeneralAttribute = getDefaultAttribute(
						attrLabelOnGeneral,
						clientId
					);

					if (
						(breakpoint === 'general' ||
							attributes[attrLabelOnGeneral] === value) &&
						defaultGeneralAttribute === value
					)
						return;

					if (breakpoint === 'general') {
						response[attrLabelOnWinBreakpoint] = value;

						return;
					}

					response[attrLabelOnWinBreakpoint] =
						attributes[attrLabelOnGeneral];
				});

				console.table(response);

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
