import { getGroupAttributes, stylesCleaner } from '../../extensions/styles';
import {
	getSizeStyles,
	getBoxShadowStyles,
	getZIndexStyles,
	getPositionStyles,
	getDisplayStyles,
	getTransformStyles,
	getMarginPaddingStyles,
	getBlockBackgroundStyles,
	getBorderStyles,
	getOpacityStyles,
	getOverflowStyles,
	getFlexStyles,
} from '../../extensions/styles/helpers';
import { selectorsRow } from './custom-css';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

const getNormalObject = props => {
	const response = {
		boxShadow: getBoxShadowStyles({
			obj: {
				...getGroupAttributes(props, 'boxShadow'),
			},
			parentBlockStyle: props.parentBlockStyle,
		}),
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
		margin: getMarginPaddingStyles({
			obj: { ...getGroupAttributes(props, 'margin') },
		}),
		padding: getMarginPaddingStyles({
			obj: { ...getGroupAttributes(props, 'padding') },
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
		row: {
			general: {},
		},
		overflow: getOverflowStyles({
			...getGroupAttributes(props, 'overflow'),
		}),
		flex: getFlexStyles({
			...getGroupAttributes(props, 'flex'),
		}),
		gap: {
			general: {},
		},
	};

	const sync = props['gap-sync'];

	switch (sync) {
		case 'all':
			if (props.gap && props['gap-unit']) {
				response.gap.general['gap'] =
					props['gap'] && props['gap-unit']
						? `${props['gap']}${props['gap-unit']}`
						: 0;
			}
			break;
		case 'axis':
			response.gap.general = {
				...(props['row-gap'] &&
					props['row-gap-unit'] && {
						'row-gap': `${props['row-gap']}${props['row-gap-unit']}`,
					}),
				...(props['column-gap'] &&
					props['column-gap-unit'] && {
						'column-gap': `${props['column-gap']}${props['column-gap-unit']}`,
					}),
			};

			break;

		default:
			break;
	}

	if (!isEmpty(props.horizontalAlign))
		response.row.general['justify-content'] = props.horizontalAlign;

	if (!isEmpty(props.verticalAlign))
		response.row.general['align-items'] = props.verticalAlign;

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

const getStyles = props => {
	const { uniqueID } = props;

	const response = {
		[uniqueID]: stylesCleaner(
			{
				'': getNormalObject(props),
				':hover': getHoverObject(props),
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
			},
			selectorsRow,
			props
		),
	};

	return response;
};

export default getStyles;
