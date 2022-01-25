/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ToolbarPopover from '../toolbar-popover';
import SvgColor from '../../../svg-color';
import {
	getColorRGBAString,
	getGroupAttributes,
} from '../../../../extensions/styles';

/**
 * External dependencies
 */
import { capitalize } from 'lodash';

/**
 * Styles
 */
import './editor.scss';
import { toolbarShapeColor, toolbarShapeLineColor } from '../../../../icons';

/**
 * SvgColor
 */
const SvgColorToolbar = props => {
	const { type, blockName, onChange, changeSVGContent, parentBlockStyle } =
		props;

	if (blockName !== 'maxi-blocks/svg-icon-maxi') return null;

	const getColor = attr =>
		attr[`svg-${type}-palette-status`]
			? getColorRGBAString({
					firstVar: `icon-${type}`,
					secondVar: `color-${attr[`svg-palette-${type}-color`]}`,
					opacity: attr[`svg-palette-${type}-opacity`],
					blockStyle: parentBlockStyle,
			  })
			: attr[`svg-${type}-color`];

	return (
		<ToolbarPopover
			className='toolbar-item__background'
			// eslint-disable-next-line @wordpress/i18n-no-collapsible-whitespace
			tooltip={__(`Icon ${type} colour`, 'maxi-blocks')}
			icon={
				<div
					className='toolbar-item__icon'
					// style={{
					// 	background: getColor(props),
					// 	border: '1px solid #fff',
					// }}
				>
					{type === 'fill'
						? toolbarShapeColor
						: toolbarShapeLineColor}
				</div>
			}
		>
			<div className='toolbar-item__svg-color__popover'>
				<SvgColor
					{...getGroupAttributes(props, 'svg')}
					type={type}
					label={__(`Icon ${type}`, 'maxi-blocks')}
					onChange={obj => {
						onChange(obj);

						const colorStr = getColorRGBAString({
							firstVar: `icon-${type}`,
							secondVar: `color-${
								obj[`svg-palette-${type}-color`]
							}`,
							opacity: obj[`svg-palette-${type}-opacity`],
							blockStyle: parentBlockStyle,
						});

						changeSVGContent(
							obj[`svg-${type}-palette-status`]
								? colorStr
								: obj[`svg-${type}-color`],
							type
						);
					}}
				/>
			</div>
		</ToolbarPopover>
	);
};

export default SvgColorToolbar;
