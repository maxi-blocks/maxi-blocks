/**
 * WordPress dependencies
 */
import { isURL } from '@wordpress/url';

/**
 * Internal dependencies
 */
import {
	getGroupAttributes,
	getLastBreakpointAttribute,
	stylesCleaner,
} from '../../extensions/styles';
import {
	getAlignmentTextStyles,
	getBlockBackgroundStyles,
	getBorderStyles,
	getBoxShadowStyles,
	getCustomFormatsStyles,
	getDisplayStyles,
	getLinkStyles,
	getMarginPaddingStyles,
	getOpacityStyles,
	getOverflowStyles,
	getPositionStyles,
	getSizeStyles,
	getTransformStyles,
	getTransitionStyles,
	getTypographyStyles,
	getZIndexStyles,
} from '../../extensions/styles/helpers';
import { selectorsText } from './custom-css';
import { getSVGListStyle } from './utils';

/**
 * External dependencies
 */
import { isNil, isNumber } from 'lodash';

const getNormalObject = props => {
	const response = {
		border: getBorderStyles({
			obj: {
				...getGroupAttributes(props, [
					'border',
					'borderWidth',
					'borderRadius',
				]),
			},
			parentBlockStyle: props.parentBlockStyle,
		}),
		size: getSizeStyles({
			...getGroupAttributes(props, 'size'),
		}),
		boxShadow: getBoxShadowStyles({
			obj: {
				...getGroupAttributes(props, 'boxShadow'),
			},
			parentBlockStyle: props.parentBlockStyle,
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
		margin: getMarginPaddingStyles({
			obj: { ...getGroupAttributes(props, 'margin') },
		}),
		padding: getMarginPaddingStyles({
			obj: { ...getGroupAttributes(props, 'padding') },
		}),
		textAlignment: getAlignmentTextStyles({
			...getGroupAttributes(props, 'textAlignment'),
		}),
		overflow: getOverflowStyles({
			...getGroupAttributes(props, 'overflow'),
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
				parentBlockStyle: props.parentBlockStyle,
			}),
		boxShadow:
			props['box-shadow-status-hover'] &&
			getBoxShadowStyles({
				obj: {
					...getGroupAttributes(props, 'boxShadow', true),
				},
				isHover: true,
				parentBlockStyle: props.parentBlockStyle,
			}),
	};

	return response;
};

const getLinkObject = props => {
	const response = {
		transitionDuration: getTransitionStyles({
			...getGroupAttributes(props, 'transitionDuration'),
		}),
	};

	return response;
};

const getTypographyObject = props => {
	const response = {
		typography: getTypographyStyles({
			obj: {
				...getGroupAttributes(props, 'typography'),
			},
			parentBlockStyle: props.parentBlockStyle,
			textLevel: props.textLevel,
		}),
	};

	return response;
};

const getTypographyHoverObject = props => {
	const response = {
		typography: getTypographyStyles({
			obj: {
				...getGroupAttributes(props, 'typographyHover'),
			},
			isHover: true,
			parentBlockStyle: props.parentBlockStyle,
			textLevel: props.textLevel,
			normalTypography: {
				...getGroupAttributes(props, 'typography'),
			},
		}),
	};

	return response;
};

const getListObject = props => {
	const { listStart, listReversed } = props;

	const response = {
		...(isNumber(listStart) && {
			listStart: {
				general: {
					'counter-reset': `li ${
						listStart + (listReversed ? 1 : -1)
					}`,
				},
			},
		}),
		...(() => {
			const response = { listGap: {}, textIndent: {} };

			['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'].forEach(
				breakpoint => {
					// List gap
					const gapNum = getLastBreakpointAttribute(
						'list-gap',
						breakpoint,
						props
					);
					const gapUnit = getLastBreakpointAttribute(
						'list-gap-unit',
						breakpoint,
						props
					);

					if (!isNil(gapNum) && !isNil(gapUnit)) {
						response.listGap[breakpoint] = {
							'padding-left': gapNum + gapUnit,
						};
					}

					// List indent
					const indentNum = getLastBreakpointAttribute(
						'list-indent',
						breakpoint,
						props
					);
					const indentUnit = getLastBreakpointAttribute(
						'list-indent-unit',
						breakpoint,
						props
					);

					if (!isNil(indentNum) && !isNil(indentUnit)) {
						response.textIndent[breakpoint] = {
							'text-indent': indentNum + indentUnit,
						};
					}
				}
			);

			return response;
		})(),
	};

	return response;
};

const getListItemObject = props => {
	const { listReversed } = props;

	return {
		...(listReversed && {
			listReversed: {
				general: {
					'counter-increment': 'li -1',
				},
			},
		}),
	};
};

const getMarkerObject = props => {
	const { typeOfList, listStyle, listStyleCustom } = props;

	return {
		...(typeOfList === 'ol' && {
			listContent: {
				general: {
					content: `counters(li, "."${
						listStyle ? `, ${listStyle}` : ''
					})`,
				},
			},
		}),
		...(typeOfList === 'ul' && {
			listContent: {
				general: {
					content: `counter(li${
						listStyle && listStyle === 'custom' && listStyleCustom
							? `, ${listStyle}`
							: ', disc'
					})`,
				},
			},
		}),
		...(listStyle &&
			typeOfList === 'ol' && {
				listStyle: {
					general: {
						'list-style-type': listStyle,
					},
				},
			}),
		...(listStyle &&
			typeOfList === 'ul' && {
				listStyle: {
					general: {
						...(listStyle === 'custom' &&
							listStyleCustom && {
								...(isURL(listStyleCustom) && {
									content: `url('${listStyleCustom}')`,
								}),
								...(listStyleCustom.includes('</svg>') && {
									content: `url("data:image/svg+xml,${getSVGListStyle(
										listStyleCustom
									)}")`,
								}),
								...(!isURL(listStyleCustom) &&
									!listStyleCustom.includes('</svg>') && {
										content: `"${listStyleCustom}"`,
									}),
							}),
					},
				},
			}),
		...(() => {
			const response = { listSize: {} };

			['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'].forEach(
				breakpoint => {
					// List indent
					const indentNum =
						getLastBreakpointAttribute(
							'list-indent',
							breakpoint,
							props
						) || 0;
					const indentUnit =
						getLastBreakpointAttribute(
							'list-indent-unit',
							breakpoint,
							props
						) || 'px';

					// List size
					const sizeNum =
						getLastBreakpointAttribute(
							'list-size',
							breakpoint,
							props
						) || 0;
					const sizeUnit =
						getLastBreakpointAttribute(
							'list-size-unit',
							breakpoint,
							props
						) || 'px';

					// List position
					const position =
						getLastBreakpointAttribute(
							'list-position',
							breakpoint,
							props
						) || false;

					// Text position
					const textPosition =
						getLastBreakpointAttribute(
							'list-text-position',
							breakpoint,
							props
						) || false;

					response.listSize[breakpoint] = {
						'font-size': sizeNum + sizeUnit,
						...(position === 'outside' && {
							'margin-left': '-1em',
						}),
						...(Math.sign(indentNum) === -1 && {
							'margin-right': `calc(${
								indentNum + indentUnit
							} + 1em)`,
							'padding-left': `calc(${
								Math.abs(indentNum) + indentUnit
							} + 1em)`,
						}),
						...(listStyle === 'none' && {
							'padding-right': '1em',
						}),
						...(textPosition && {
							'vertical-align': textPosition,
						}),
					};
				}
			);

			return response;
		})(),
	};
};

const getStyles = props => {
	const { uniqueID, isList, textLevel, typeOfList } = props;
	const element = isList ? typeOfList : textLevel;

	return {
		[uniqueID]: stylesCleaner(
			{
				'': getNormalObject(props),
				' .maxi-text-block--link, .maxi-text-block--link span':
					getLinkObject(props),
				':hover': getHoverObject(props),
				...(!isList && {
					[` ${element}.maxi-text-block__content`]:
						getTypographyObject(props, isList),
					[` ${element}.maxi-text-block__content:hover`]:
						getTypographyHoverObject(props),
				}),
				...(isList && {
					[` ${element}.maxi-text-block__content`]:
						getListObject(props),
					[` ${element}.maxi-text-block__content li`]: {
						...getTypographyObject(props),
						...getListItemObject(props),
					},
					[` ${element}.maxi-text-block__content li:hover`]:
						getTypographyHoverObject(props),
					[` ${element}.maxi-text-block__content li::before`]:
						getMarkerObject(props),
				}),
				...getBlockBackgroundStyles({
					...getGroupAttributes(props, [
						'blockBackground',
						'border',
						'borderWidth',
						'borderRadius',
					]),
					blockStyle: props.parentBlockStyle,
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
					blockStyle: props.parentBlockStyle,
				}),
				...getCustomFormatsStyles(
					!isList
						? ' .maxi-text-block__content'
						: ' .maxi-text-block__content li',
					props['custom-formats'],
					false,
					{ ...getGroupAttributes(props, 'typography') },
					props.textLevel,
					props.parentBlockStyle
				),
				...getCustomFormatsStyles(
					!isList
						? ':hover .maxi-text-block__content'
						: ':hover .maxi-text-block__content li',
					props['custom-formats-hover'],
					true,
					getGroupAttributes(props, [
						'typography',
						'typographyHover',
					]),
					props.textLevel,
					props.parentBlockStyle
				),
				...getLinkStyles(
					{ ...getGroupAttributes(props, 'link') },
					[` a ${element}.maxi-text-block__content`],
					props.parentBlockStyle
				),
				...getLinkStyles(
					{ ...getGroupAttributes(props, 'link') },
					[` ${element}.maxi-text-block__content a`],
					props.parentBlockStyle
				),
			},
			selectorsText,
			props
		),
	};
};

export default getStyles;
