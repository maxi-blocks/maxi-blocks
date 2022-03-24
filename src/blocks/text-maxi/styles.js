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
import parse from 'html-react-parser';

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
	const { listStyle, listStart, listReversed, content, isRTL } = props;

	let counterReset;
	if (isNumber(listStart)) {
		counterReset =
			listStart < 0 &&
			(['decimal', 'details'].includes(listStyle) || !listStyle)
				? listStart
				: 0;
		counterReset += listStart > 0 ? listStart : 0;
		counterReset += listReversed ? parse(content).length : 1;
		counterReset += listReversed ? 1 : -1;
		counterReset -= 1;
	} else if (listReversed) counterReset = parse(content).length + 1;
	else counterReset = 0;

	const response = {
		listStart: {
			general: {
				'counter-reset': `li ${counterReset}`,
			},
		},
		...(() => {
			const response = { listGap: {}, textIndent: {} };

			['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'].forEach(
				breakpoint => {
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
					
					if (!isNil(gapNum) && !isNil(gapUnit)) {
						response.listGap[breakpoint] = isRTL
							? {
									'padding-right': gapNum + gapUnit,
							  }
							: {
									'padding-left': gapNum + gapUnit,
							  };
					}

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

const getListParagraphObject = props => {
	const response = {
		...(() => {
			const response = { paragraphSpacing: {} };

			['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'].forEach(
				breakpoint => {
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
				}
			);

			return response;
		})(),
	};

	return response;
};

const getMarkerObject = props => {
	const { typeOfList, listStyle, listStyleCustom, parentBlockStyle, isRTL } =
		props;

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
							blockStyle: parentBlockStyle,
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

			['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'].forEach(
				breakpoint => {
					// List indent
					const indentNum =
						getLastBreakpointAttribute({
							target: 'list-indent',
							breakpoint,
							attributes: props,
						}) || 0;
					const indentUnit =
						getLastBreakpointAttribute({
							target: 'list-indent-unit',
							breakpoint,
							attributes: props,
						}) || 'px';
					const indentSum = indentNum + indentUnit;

					// List size
					const sizeNum =
						getLastBreakpointAttribute({
							target: 'list-size',
							breakpoint,
							attributes: props,
						}) || 0;
					const sizeUnit =
						getLastBreakpointAttribute({
							target: 'list-size-unit',
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

					response.listSize[breakpoint] = {
						...(typeOfList === 'ul' &&
						listStyle === 'custom' &&
						listStyleCustom &&
						listStyleCustom.includes('</svg>')
							? {
									width: sizeNum + sizeUnit,
							  }
							: { 'font-size': sizeNum + sizeUnit }),
						'line-height':
							lineHeightMarkerNum +
							(lineHeightMarkerUnit !== '-'
								? lineHeightMarkerUnit
								: ''),
						'margin-right': isRTL ? indentSum : indentMarkerSum,
						'margin-left': isRTL ? indentMarkerSum : indentSum,
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
	const { isRTL } = select('core/editor').getEditorSettings();

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
