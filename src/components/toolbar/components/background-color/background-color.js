/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ToolbarPopover from '../toolbar-popover';
import ColorLayer from '../../../background-control/colorLayer';
import {
	getAttributeKey,
	getGroupAttributes,
	getLastBreakpointAttribute,
} from '../../../../extensions/styles';
import ToggleSwitch from '../../../toggle-switch';

/**
 * Styles
 */
import './editor.scss';

/**
 * Icons
 */
import { backgroundColor } from '../../../../icons';

/**
 * BackgroundColor
 */

const ALLOWED_BLOCKS = ['maxi-blocks/button-maxi'];

const BackgroundColor = props => {
	const {
		blockName,
		onChange,
		clientId,
		breakpoint,
		prefix = '',
		globalProps,
		advancedOptions = 'background',
	} = props;

	if (!ALLOWED_BLOCKS.includes(blockName)) return null;

	const activeMedia = getLastBreakpointAttribute({
		target: `${prefix}background-active-media`,
		breakpoint,
		attributes: props,
	});
	const isBackgroundColor = activeMedia === 'color';

	return (
		<ToolbarPopover
			className='toolbar-item__background'
			advancedOptions={advancedOptions}
			tab={0}
			tooltip={
				!isBackgroundColor
					? __('Background Colour Disabled', 'maxi-blocks')
					: __('Background Colour', 'maxi-blocks')
			}
			icon={backgroundColor}
		>
			<div className='toolbar-item__background__popover'>
				<ToggleSwitch
					label={__('Enable background colour', 'maxi-blocks')}
					selected={isBackgroundColor}
					onChange={val => {
						onChange({
							[getAttributeKey(
								'background-active-media',
								false,
								prefix,
								breakpoint
							)]: val ? 'color' : 'none',
						});
					}}
				/>
				{isBackgroundColor && (
					<ColorLayer
						colorOptions={{
							...getGroupAttributes(
								props,
								'backgroundColor',
								false,
								prefix
							),
						}}
						key={`background-color-layer--${clientId}`}
						onChange={obj => onChange(obj)}
						breakpoint={breakpoint}
						globalProps={globalProps}
						prefix={prefix}
						clientId={clientId}
						disableClipPath
						isToolbar
						disableResponsiveTabs
					/>
				)}
			</div>
		</ToolbarPopover>
	);
};

export default BackgroundColor;
