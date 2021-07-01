/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ToolbarPopover from '../toolbar-popover';
import SvgColor from '../../../svg-color';
import { getGroupAttributes } from '../../../../extensions/styles';

/**
 * External dependencies
 */
import { capitalize } from 'lodash';

/**
 * Styles
 */
import './editor.scss';

/**
 * SvgColor
 */
const SvgColorToolbar = props => {
	const { type, blockName, onChange, changeSVGContent, parentBlockStyle } =
		props;

	if (blockName !== 'maxi-blocks/svg-icon-maxi') return null;

	const getColor = attr =>
		attr[`svg-palette-${type}-color-status`]
			? `var(--maxi-${parentBlockStyle}-icon-${type}, var(--maxi-${parentBlockStyle}-color-${
					attr[`svg-palette-${type}-color`]
			  }))`
			: attr[`svg-${type}-color`];

	const typeNumber = {
		fill: 1,
		line: 2,
	};

	return (
		<ToolbarPopover
			className='toolbar-item__background'
			// eslint-disable-next-line @wordpress/i18n-no-collapsible-whitespace
			tooltip={__(`SVG ${capitalize(type)} Colour`, 'maxi-blocks')}
			icon={
				<div
					className='toolbar-item__icon'
					style={{
						background: getColor(props),
						border: '1px solid #fff',
					}}
				/>
			}
		>
			<div className='toolbar-item__svg-color__popover'>
				<SvgColor
					{...getGroupAttributes(props, 'svg')}
					type={type}
					label={__(`SVG ${capitalize(type)}`, 'maxi-blocks')}
					onChange={obj => {
						onChange(obj);

						changeSVGContent(getColor(obj), typeNumber[type]);
					}}
				/>
			</div>
		</ToolbarPopover>
	);
};

export default SvgColorToolbar;
