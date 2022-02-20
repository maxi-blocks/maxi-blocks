/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ToolbarPopover from '../toolbar-popover';
import Icon from '../../../icon';
import AdvancedNumberControl from '../../../advanced-number-control';
import { getDefaultAttribute } from '../../../../extensions/styles';
import { DefaultDividersControl } from '../../../divider-control';

/**
 * Styles & Icons
 */
import './editor.scss';
import { toolbarBorder, borderWidth } from '../../../../icons';

/**
 * Divider
 */

const Divider = props => {
	const { blockName, lineOrientation, onChange } = props;

	if (blockName !== 'maxi-blocks/divider-maxi') return null;

	const minMaxSettings = {
		px: {
			min: 0,
			max: 999,
		},
		em: {
			min: 0,
			max: 999,
		},
		vw: {
			min: 0,
			max: 100,
		},
		'%': {
			min: 0,
			max: 100,
		},
	};

	return (
		<ToolbarPopover
			className='toolbar-item__divider-line'
			tooltip={__('Divider style', 'maxi-blocks')}
			icon={toolbarBorder}
			advancedOptions='line settings'
		>
			<div className='toolbar-item__divider-line__popover'>
				<DefaultDividersControl
					lineOrientation={lineOrientation}
					onChange={onChange}
				/>
				{lineOrientation === 'horizontal' && (
					<>
						<div className='divider-border__weight-wrap'>
							<div
								className={
									props['divider-border-style'] === 'none' &&
									'divider-border__weight-disable'
								}
							>
								<Icon icon={borderWidth} />
								<AdvancedNumberControl
									value={props['divider-border-top-width']}
									onChangeValue={val =>
										onChange({
											'divider-border-top-width': val,
										})
									}
									onReset={() =>
										onChange({
											'divider-border-top-width':
												getDefaultAttribute(
													'divider-border-top-width'
												),
											'divider-border-top-unit':
												getDefaultAttribute(
													'divider-border-top-unit'
												),
										})
									}
									minMaxSettings={minMaxSettings}
								/>
							</div>
						</div>
						<AdvancedNumberControl
							className={
								props['divider-border-style'] === 'none' &&
								'divider-border__size-disable'
							}
							label={__('Line size', 'maxi-blocks')}
							value={props['divider-width']}
							onChangeValue={val =>
								onChange({ 'divider-width': val })
							}
							onReset={() =>
								onChange({
									'divider-width':
										getDefaultAttribute('divider-width'),
									'divider-width-unit':
										getDefaultAttribute(
											'divider-width-unit'
										),
								})
							}
							minMaxSettings={minMaxSettings}
						/>
					</>
				)}
				{lineOrientation === 'vertical' && (
					<>
						<div className='divider-border__weight-wrap'>
							<div
								className={
									props['divider-border-style'] === 'none' &&
									'divider-border__weight-disable'
								}
							>
								<Icon icon={borderWidth} />
								<AdvancedNumberControl
									label={__('', 'maxi-blocks')}
									value={props['divider-border-right-width']}
									onChangeValue={val => {
										onChange({
											'divider-border-right-width':
												val !== undefined && val !== ''
													? val
													: '',
										});
									}}
									min={0}
									max={100}
									onReset={() =>
										onChange({
											'divider-border-right-width':
												getDefaultAttribute(
													'divider-border-right-width'
												),
										})
									}
									initialPosition={getDefaultAttribute(
										'divider-border-right-width'
									)}
								/>
							</div>
						</div>
						<AdvancedNumberControl
							className={
								props['divider-border-style'] === 'none' &&
								'divider-border__size-disable'
							}
							label={__('Size', 'maxi-blocks')}
							value={
								props['divider-height'] !== undefined &&
								props['divider-height'] !== ''
									? props['divider-height']
									: ''
							}
							onChangeValue={val => {
								onChange({
									'divider-height':
										val !== undefined && val !== ''
											? val
											: '',
								});
							}}
							min={0}
							max={100}
							onReset={() =>
								onChange({
									'divider-height':
										getDefaultAttribute('divider-height'),
								})
							}
							initialPosition={getDefaultAttribute(
								'divider-height'
							)}
						/>
					</>
				)}
			</div>
		</ToolbarPopover>
	);
};

export default Divider;
