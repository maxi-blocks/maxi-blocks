/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';

/**
 * Internal dependencies
 */
import ColorControl from '../color-control';
import ClipPath from '../clip-path-control';
import {
	getDefaultAttribute,
	getAttributeKey,
	getGroupAttributes,
} from '../../extensions/styles';
import getStyleCardAttr from '../../extensions/styles/defaults/style-card';
import ColorPaletteControl from '../color-palette-control';

/**
 * External dependencies
 */
import { cloneDeep } from 'lodash';

/**
 * Component
 */
const ColorLayer = props => {
	const {
		onChange,
		disableClipPath,
		isHover,
		prefix,
		scAtt,
		blockStyle,
		useStyleCard,
		noPalette,
		attributes,
	} = props;

	const colorOptions = cloneDeep(props.colorOptions);

	const getBlockStyle = () => {
		switch (blockStyle) {
			case 'maxi-light':
				return 'light';
			case 'maxi-dark':
				return 'dark';
			case 'maxi-parent': {
				// return getBlockAttributes(
				// 	getBlockParents(clientId)[0]
				// ).blockStyle.replace('maxi-', '');
				return 'light';
			}
			default:
				return 'light';
		}
	};

	const getColor = () => {
		const color =
			colorOptions[getAttributeKey('background-color', isHover, prefix)];
		if (color === 'styleCard')
			return getStyleCardAttr(scAtt, getBlockStyle(), false);
		return color;
	};

	const getDefaultColor = () => {
		if (useStyleCard)
			return getStyleCardAttr(scAtt, getBlockStyle(), false);
		return getDefaultAttribute(
			getAttributeKey('background-color', isHover, prefix)
		);
	};

	return (
		<Fragment>
			{!noPalette && (
				<Fragment>
					<ColorPaletteControl
						{...getGroupAttributes(attributes, 'palette')}
						className={`maxi-color-palette--${getBlockStyle()}`}
						onChange={obj => onChange(obj)}
					/>
				</Fragment>
			)}
			{attributes['palette-custom-color'] && (
				<ColorControl
					label={__('Background', 'maxi-blocks')}
					color={
						colorOptions[
							getAttributeKey('background-color', isHover, prefix)
						]
					}
					defaultColor={getDefaultAttribute(
						getAttributeKey('background-color', isHover, prefix)
					)}
					onChange={val => {
						colorOptions[
							getAttributeKey('background-color', isHover, prefix)
						] = val;

						onChange(colorOptions);
					}}
				/>
			)}
			{!disableClipPath && (
				<ClipPath
					clipPath={
						colorOptions[
							getAttributeKey(
								'background-color-clip-path',
								isHover,
								prefix
							)
						]
					}
					onChange={val => {
						colorOptions[
							getAttributeKey(
								'background-color-clip-path',
								isHover,
								prefix
							)
						] = val;

						onChange(colorOptions);
					}}
				/>
			)}
		</Fragment>
	);
};

export default ColorLayer;
