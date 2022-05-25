import {
	getGroupAttributes,
	getLastBreakpointAttribute,
	stylesCleaner,
} from '../../extensions/styles';
import {
	getBackgroundDisplayerStyles,
	getBorderStyles,
	getSizeStyles,
	getBoxShadowStyles,
	getOpacityStyles,
	getZIndexStyles,
	getPositionStyles,
	getDisplayStyles,
	getTransformStyles,
	getTransitionStyles,
	getArrowStyles,
	getBlockBackgroundStyles,
	getMarginPaddingStyles,
	getOverflowStyles,
	getFlexStyles,
} from '../../extensions/styles/helpers';
import { selectorsGroup } from './custom-css';
import { transitionObj } from './edit';
import { isNil } from 'lodash';

const getNormalObject = props => {
	const response = {
		margin: getMarginPaddingStyles({
			obj: { ...getGroupAttributes(props, 'margin') },
		}),
		padding: getMarginPaddingStyles({
			obj: { ...getGroupAttributes(props, 'padding') },
		}),
		border: getBorderStyles({
			obj: {
				...getGroupAttributes(props, [
					'border',
					'borderWidth',
					'borderRadius',
				]),
			},
			blockStyle: props.blockStyle,
		}),
		size: getSizeStyles({
			...getGroupAttributes(props, 'size'),
			fullWidth: props.blockFullWidth,
		}),
		boxShadow: getBoxShadowStyles({
			obj: {
				...getGroupAttributes(props, 'boxShadow'),
			},
			blockStyle: props.blockStyle,
		}),
		opacity: getOpacityStyles({
			...getGroupAttributes(props, 'opacity'),
		}),
		zIndex: getZIndexStyles({
			...getGroupAttributes(props, 'zIndex'),
		}),
		position: getPositionStyles({
			...getGroupAttributes(props, 'position'),
		}),
		display: getDisplayStyles({
			...getGroupAttributes(props, 'display'),
		}),
		transform: getTransformStyles({
			...getGroupAttributes(props, 'transform'),
		}),
		// transition: getTransitionStyles(
		// 	{
		// 		...getGroupAttributes(props, 'transition'),
		// 	},
		// 	'block',
		// 	['border', 'box shadow']
		// ),
		overflow: getOverflowStyles({
			...getGroupAttributes(props, 'overflow'),
		}),
		flex: getFlexStyles({
			...getGroupAttributes(props, 'flex'),
		}),
	};

	return response;
};

const getHoverObject = props => {
	const response = {
		border:
			props['border-status-hover'] &&
			getBorderStyles({
				obj: {
					...getGroupAttributes(
						props,
						['border', 'borderWidth', 'borderRadius'],
						true
					),
				},
				isHover: true,
				blockStyle: props.blockStyle,
			}),
		boxShadow:
			props['box-shadow-status-hover'] &&
			getBoxShadowStyles({
				obj: {
					...getGroupAttributes(props, 'boxShadow', true),
				},
				isHover: true,
				blockStyle: props.blockStyle,
			}),
	};

	return response;
};

/**
 * Draft, needs to be cleaned and organized on its correct place
 */
const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

const getTransitionStylesPrototype = props => {
	const { transition } = props;

	const response = {};

	Object.entries(transitionObj).forEach(([key, value]) => {
		const { target, property, limitless = false } = value;

		if (isNil(response[target])) response[target] = { transition: {} };

		breakpoints.forEach(breakpoint => {
			const transitionContent = transition.block[key]; // set .block temporary

			let transitionString = '';

			const transitionDuration = getLastBreakpointAttribute({
				target: 'transition-duration',
				breakpoint,
				attributes: transitionContent,
			});

			const transitionDelay = getLastBreakpointAttribute({
				target: 'transition-delay',
				breakpoint,
				attributes: transitionContent,
			});

			const transitionTimingFunction = getLastBreakpointAttribute({
				target: 'easing',
				breakpoint,
				attributes: transitionContent,
			});

			if (
				transitionDuration ||
				transitionDelay ||
				transitionTimingFunction
			) {
				transitionString += `${
					limitless ? 'all' : property
				} ${transitionDuration}s ${transitionDelay}s ${transitionTimingFunction} ${
					transitionContent.property || ''
				}, `;
			}

			transitionString = transitionString.replace(/,\s*$/, '');

			if (isNil(response[target].transition[breakpoint]))
				response[target].transition[breakpoint] = {
					transition: transitionString,
				};
			else
				response[target].transition[
					breakpoint
				].transition += `, ${transitionString}`;
		});
	});

	return response;
};

const getStyles = props => {
	const { uniqueID } = props;

	console.log(
		getTransitionStylesPrototype({
			...getGroupAttributes(props, 'transition'),
		})
	);

	const response = {
		[uniqueID]: stylesCleaner(
			{
				'': getNormalObject(props),
				':hover': getHoverObject(props),
				// ...getBackgroundDisplayerStyles({
				// 	...getGroupAttributes(props, 'transition'),
				// }),
				...getBlockBackgroundStyles({
					...getGroupAttributes(props, [
						'blockBackground',
						'border',
						'borderWidth',
						'borderRadius',
					]),
					blockStyle: props.blockStyle,
				}),
				...getBlockBackgroundStyles({
					...getGroupAttributes(
						props,
						[
							'blockBackground',
							'border',
							'borderWidth',
							'borderRadius',
						],
						true
					),
					isHover: true,
					blockStyle: props.blockStyle,
				}),
				...getArrowStyles({
					...getGroupAttributes(props, [
						'arrow',
						'border',
						'borderWidth',
						'borderRadius',
						'blockBackground',
						'boxShadow',
					]),
					blockStyle: props.blockStyle,
				}),
				...getArrowStyles({
					...getGroupAttributes(
						props,
						[
							'arrow',
							'border',
							'borderWidth',
							'borderRadius',
							'blockBackground',
							'boxShadow',
						],
						true
					),
					...getGroupAttributes(props, ['arrow']),
					blockStyle: props.blockStyle,
					isHover: true,
				}),
				...getTransitionStylesPrototype({
					...getGroupAttributes(props, 'transition'),
				}),
			},
			selectorsGroup,
			props
		),
	};

	return response;
};

export default getStyles;
