/**
 * WordPress dependencies
 */
import { isURL } from '@wordpress/url';
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import {
	getColorRGBAString,
	getGroupAttributes,
	getLastBreakpointAttribute,
	getPaletteAttributes,
	styleProcessor,
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
	getTypographyStyles,
	getZIndexStyles,
	getFlexStyles,
} from '../../extensions/styles/helpers';
import data from './data';
import { getSVGListStyle } from './utils';

/**
 * External dependencies
 */
import { isNil, isNumber } from 'lodash';
import parse from 'html-react-parser';

const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

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
			blockStyle: props.blockStyle,
		}),
		size: getSizeStyles({
			...getGroupAttributes(props, 'size'),
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
		opacity:
			props['opacity-status-hover'] &&
			getOpacityStyles(
				{ ...getGroupAttributes(props, 'opacity', true) },
				true
			),
	};

	return response;
};

const getTypographyObject = props => {
	const response = {
		typography: getTypographyStyles({
			obj: {
				...getGroupAttributes(props, 'typography'),
			},
			blockStyle: props.blockStyle,
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
			blockStyle: props.blockStyle,
			textLevel: props.textLevel,
			normalTypography: {
				...getGroupAttributes(props, 'typography'),
			},
		}),
	};

	return response;
};

const getListObject = props => {
	const { listStyle, listStart, listReversed, content } = props;

	let counterReset;
	if (isNumber(listStart)) {
		counterReset =
			listStart < 0 &&
			(['decimal', 'details'].includes(listStyle) || !listStyle)
				? listStart
				: 0;
		counterReset += listStart > 0 ? listStart : 0;
		counterReset +=
			listReversed && parse(content).length ? parse(content).length : 1;
		counterReset += listReversed ? 1 : -1;
		counterReset -= 1;
	} else if (listReversed)
		counterReset = parse(content).length ? parse(content).length + 1 : 2;
	else counterReset = 0;

	const response = {
		listStart: {
			general: {
				'counter-reset': `li ${counterReset}`,
			},
		},
		...(() => {
			const response = { listGap: {}, bottomGap: {} };

			breakpoints.forEach(breakpoint => {
				const isRTL =
					props.isRTL ||
					getLastBreakpointAttribute({
						target: 'text-direction',
						breakpoint,
						attributes: props,
					}) === 'rtl';

				// List gap
				const gapNum = getLastBreakpointAttribute({
					target: 'list-gap',
					breakpoint,
					attributes: props,
				});
				const gapUnit = getLastBreakpointAttribute({
					target: 'list-gap-unit',
					breakpoint,
					attributes: props,
				});

				// List style position
				const listStylePosition = getLastBreakpointAttribute({
					target: 'list-style-position',
					breakpoint,
					attributes: props,
				});

				// List marker size
				const sizeNum =
					getLastBreakpointAttribute({
						target: 'list-marker-size',
						breakpoint,
						attributes: props,
					}) || 0;
				const sizeUnit =
					getLastBreakpointAttribute({
						target: 'list-marker-size-unit',
						breakpoint,
						attributes: props,
					}) || 'px';

				// Marker indent
				const indentMarkerNum =
					getLastBreakpointAttribute({
						target: 'list-marker-indent',
						breakpoint,
						attributes: props,
					}) || 0;
				const indentMarkerUnit =
					getLastBreakpointAttribute({
						target: 'list-marker-indent-unit',
						breakpoint,
						attributes: props,
					}) || 'px';

				const indentMarkerSum = indentMarkerNum + indentMarkerUnit;

				const padding =
					listStylePosition === 'inside'
						? gapNum + gapUnit
						: `calc(${gapNum + gapUnit} + ${
								sizeNum + sizeUnit
						  } + ${indentMarkerSum})`;

				if (!isNil(gapNum) && !isNil(gapUnit)) {
					response.listGap[breakpoint] = {
						[`padding-${isRTL ? 'right' : 'left'}`]: padding,
					};
				}

				// Bottom gap
				const bottomGapNum = getLastBreakpointAttribute({
					target: 'bottom-gap',
					breakpoint,
					attributes: props,
				});
				const bottomGapUnit = getLastBreakpointAttribute({
					target: 'bottom-gap-unit',
					breakpoint,
					attributes: props,
				});

				if (!isNil(bottomGapNum) && !isNil(bottomGapUnit)) {
					response.bottomGap[breakpoint] = {
						'margin-bottom': bottomGapNum + bottomGapUnit,
					};
				}
			});

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
		...(() => {
			const response = {
				textIndent: {},
			};

			breakpoints.forEach(breakpoint => {
				// List indent
				const indentNum = getLastBreakpointAttribute({
					target: 'list-indent',
					breakpoint,
					attributes: props,
				});
				const indentUnit = getLastBreakpointAttribute({
					target: 'list-indent-unit',
					breakpoint,
					attributes: props,
				});

				if (!isNil(indentNum) && !isNil(indentUnit)) {
					response.textIndent[breakpoint] = {
						'text-indent': indentNum + indentUnit,
					};
				}
			});

			return response;
		})(),
	};
};

const getListParagraphObject = props => {
	const response = {
		...(() => {
			const response = { paragraphSpacing: {} };

			breakpoints.forEach(breakpoint => {
				// List gap
				const paragraphSpacingNum = getLastBreakpointAttribute({
					target: 'list-paragraph-spacing',
					breakpoint,
					attributes: props,
				});
				const paragraphSpacingUnit = getLastBreakpointAttribute({
					target: 'list-paragraph-spacing-unit',
					breakpoint,
					attributes: props,
				});

				if (
					!isNil(paragraphSpacingNum) &&
					!isNil(paragraphSpacingUnit)
				) {
					response.paragraphSpacing[breakpoint] = {
						'margin-top':
							paragraphSpacingNum + paragraphSpacingUnit,
					};
				}
			});

			return response;
		})(),
	};

	return response;
};

const getMarkerObject = props => {
	const { typeOfList, listStyle, listStyleCustom, blockStyle } = props;

	const { paletteStatus, paletteColor, paletteOpacity, color } =
		getPaletteAttributes({
			obj: props,
			prefix: 'list-',
		});

	return {
		color: {
			general: {
				color: paletteStatus
					? getColorRGBAString({
							firstVar: `color-${paletteColor}`,
							opacity: paletteOpacity,
							blockStyle,
					  })
					: color,
			},
		},
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
							? `, ${listStyleCustom}`
							: `, ${listStyle ?? 'disc'}`
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

			breakpoints.forEach(breakpoint => {
				const isRTL =
					props.isRTL ||
					getLastBreakpointAttribute({
						target: 'text-direction',
						breakpoint,
						attributes: props,
					}) === 'rtl';

				// List style position
				const listStylePosition = getLastBreakpointAttribute({
					target: 'list-style-position',
					breakpoint,
					attributes: props,
				});

				// List marker size
				const sizeNum =
					getLastBreakpointAttribute({
						target: 'list-marker-size',
						breakpoint,
						attributes: props,
					}) || 0;
				const sizeUnit =
					getLastBreakpointAttribute({
						target: 'list-marker-size-unit',
						breakpoint,
						attributes: props,
					}) || 'px';

				// List marker height
				const heightNum = getLastBreakpointAttribute({
					target: 'list-marker-height',
					breakpoint,
					attributes: props,
				});
				const heightUnit =
					getLastBreakpointAttribute({
						target: 'list-marker-height-unit',
						breakpoint,
						attributes: props,
					}) || 'px';

				// Text position
				const textPosition =
					getLastBreakpointAttribute({
						target: 'list-text-position',
						breakpoint,
						attributes: props,
					}) || false;

				// Marker indent
				const indentMarkerNum =
					getLastBreakpointAttribute({
						target: 'list-marker-indent',
						breakpoint,
						attributes: props,
					}) || 0;
				const indentMarkerUnit =
					getLastBreakpointAttribute({
						target: 'list-marker-indent-unit',
						breakpoint,
						attributes: props,
					}) || 'px';

				const indentMarkerSum = indentMarkerNum + indentMarkerUnit;
				const markerPosition =
					listStylePosition === 'inside'
						? 0
						: `calc(${-indentMarkerNum + indentMarkerUnit})`;

				// Marker line-height
				const lineHeightMarkerNum =
					getLastBreakpointAttribute({
						target: 'list-marker-line-height',
						breakpoint,
						attributes: props,
					}) || 0;
				const lineHeightMarkerUnit =
					getLastBreakpointAttribute({
						target: 'list-marker-line-height-unit',
						breakpoint,
						attributes: props,
					}) || 'px';

				// Marker vertical offset
				const verticalOffsetMarkerNum =
					getLastBreakpointAttribute({
						target: 'list-marker-vertical-offset',
						breakpoint,
						attributes: props,
					}) || 0;
				const verticalOffsetMarkerUnit =
					getLastBreakpointAttribute({
						target: 'list-marker-vertical-offset-unit',
						breakpoint,
						attributes: props,
					}) || 'px';

				response.listSize[breakpoint] = {
					...(typeOfList === 'ul' &&
					listStyle === 'custom' &&
					listStyleCustom &&
					listStyleCustom.includes('</svg>')
						? {
								width: sizeNum + sizeUnit,
								...(!isNil(heightNum) && {
									height: heightNum + heightUnit,
									// Vertically center the SVG marker content if the height is set
									...(textPosition === 'middle' && {
										top: `calc(${
											heightNum / 2 + heightUnit
										} - (${sizeNum / 2 + sizeUnit}))`,
									}),
								}),
						  }
						: {
								'font-size': sizeNum + sizeUnit,
						  }),
					'line-height':
						lineHeightMarkerNum +
						(lineHeightMarkerUnit !== '-'
							? lineHeightMarkerUnit
							: ''),
					...(verticalOffsetMarkerNum && {
						transform: `translateY(${verticalOffsetMarkerNum}${verticalOffsetMarkerUnit})`,
					}),
					[isRTL ? 'right' : 'left']: markerPosition,
					...(listStylePosition === 'outside' &&
						(listStyle !== 'custom'
							? {
									width: '1em',
									[isRTL ? 'margin-right' : 'margin-left']:
										'-1em',
							  }
							: {
									'margin-left': -sizeNum + sizeUnit,
							  })),
					...(listStylePosition === 'inside' && {
						'margin-right': indentMarkerSum,
					}),
					...(textPosition && {
						'vertical-align': textPosition,
					}),
				};
			});

			return response;
		})(),
	};
};

const getStyles = props => {
	const { uniqueID, isList, textLevel, typeOfList } = props;
	const element = isList ? typeOfList : textLevel;
	const { isRTL } = select('core/editor').getEditorSettings();

	return {
		[uniqueID]: styleProcessor(
			{
				'': getNormalObject(props),
				':hover': getHoverObject(props),
				...(!isList && {
					[` ${element}.maxi-text-block__content`]:
						getTypographyObject(props, isList),
					[` ${element}.maxi-text-block__content:hover`]:
						getTypographyHoverObject(props),
				}),
				...(isList && {
					[` ${element}.maxi-text-block__content`]: getListObject({
						...props,
						isRTL,
					}),
					[` ${element}.maxi-text-block__content li`]: {
						...getTypographyObject(props),
						...getListItemObject(props),
					},
					[` ${element}.maxi-text-block__content li:not(:first-child)`]:
						{ ...getListParagraphObject(props) },
					[` ${element}.maxi-text-block__content li:hover`]:
						getTypographyHoverObject(props),
					[` ${element}.maxi-text-block__content li::before`]:
						getMarkerObject({ ...props, isRTL }),
				}),
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
				...getCustomFormatsStyles(
					!isList
						? ' .maxi-text-block__content'
						: ' .maxi-text-block__content li',
					props['custom-formats'],
					false,
					{ ...getGroupAttributes(props, 'typography') },
					props.textLevel,
					props.blockStyle
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
					props.blockStyle
				),
				...getLinkStyles(
					{
						...getGroupAttributes(props, [
							'link',
							'typography',
							'typographyHover',
						]),
					},
					[` a ${element}.maxi-text-block__content`],
					props.blockStyle
				),
				...getLinkStyles(
					{
						...getGroupAttributes(props, [
							'link',
							'typography',
							'typographyHover',
						]),
					},
					[` ${element}.maxi-text-block__content a`],
					props.blockStyle
				),
			},
			data,
			props
		),
	};
};

export default getStyles;
