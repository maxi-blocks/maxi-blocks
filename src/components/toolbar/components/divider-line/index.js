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
import {
	getDefaultAttribute,
	getLastBreakpointAttribute,
} from '../../../../extensions/attributes';
import { DefaultDividersControl } from '../../../divider-control';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Styles & Icons
 */
import './editor.scss';
import { toolbarBorder, borderWidth } from '../../../../icons';

/**
 * Divider
 */

const Divider = props => {
	const { blockName, onChange, breakpoint } = props;

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

	const lineOrientation = getLastBreakpointAttribute({
		target: '_lo',
		breakpoint,
		attributes: props,
	});

	const dividerBorderStyle = getLastBreakpointAttribute({
		target: 'di-bo_s',
		breakpoint,
		attributes: props,
	});

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
					breakpoint={breakpoint}
					dividerBorderStyle={getLastBreakpointAttribute({
						target: 'di-bo_s',
						breakpoint,
						attributes: props,
					})}
				/>
				{lineOrientation === 'horizontal' && (
					<>
						<div className='divider-border__weight-wrap'>
							<div
								className={classnames(
									dividerBorderStyle === 'none' &&
										'divider-border__weight-disable'
								)}
							>
								<Icon icon={borderWidth} />
								<AdvancedNumberControl
									value={getLastBreakpointAttribute({
										target: 'di-bo.t',
										breakpoint,
										attributes: props,
									})}
									onChangeValue={val =>
										onChange({
											[`di-bo.t-${breakpoint}`]: val,
										})
									}
									onReset={() =>
										onChange({
											[`di-bo.t-${breakpoint}`]:
												getDefaultAttribute(
													`di-bo.t-${breakpoint}`
												),
											[`di-bo.t.u-${breakpoint}`]:
												getDefaultAttribute(
													`di-bo.t.u-${breakpoint}`
												),
											isReset: true,
										})
									}
									minMaxSettings={minMaxSettings}
								/>
							</div>
						</div>
						<AdvancedNumberControl
							className={
								dividerBorderStyle === 'none' &&
								'divider-border__size-disable'
							}
							label={__('Line size', 'maxi-blocks')}
							value={getLastBreakpointAttribute({
								target: 'di_w',
								breakpoint,
								attributes: props,
							})}
							onChangeValue={val =>
								onChange({
									[`di_w-${breakpoint}`]: val,
								})
							}
							onReset={() =>
								onChange({
									[`di_w-${breakpoint}`]: getDefaultAttribute(
										`di_w-${breakpoint}`
									),
									[`di_w.u-${breakpoint}`]:
										getDefaultAttribute(
											`di_w.u-${breakpoint}`
										),
									isReset: true,
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
									dividerBorderStyle === 'none' &&
									'divider-border__weight-disable'
								}
							>
								<Icon icon={borderWidth} />
								<AdvancedNumberControl
									value={getLastBreakpointAttribute({
										target: 'di-bo.r',
										breakpoint,
										attributes: props,
									})}
									onChangeValue={val => {
										onChange({
											[`di-bo.r-${breakpoint}`]:
												val !== undefined && val !== ''
													? val
													: '',
										});
									}}
									min={0}
									max={100}
									onReset={() =>
										onChange({
											[`di-bo.r-${breakpoint}`]:
												getDefaultAttribute(
													`di-bo.r-${breakpoint}`
												),
											isReset: true,
										})
									}
									initialPosition={getDefaultAttribute(
										`di-bo.r-${breakpoint}`
									)}
								/>
							</div>
						</div>
						<AdvancedNumberControl
							className={
								dividerBorderStyle === 'none' &&
								'divider-border__size-disable'
							}
							label={__('Size', 'maxi-blocks')}
							value={getLastBreakpointAttribute({
								target: 'di_h',
								breakpoint,
								attributes: props,
							})}
							onChangeValue={val => {
								onChange({
									[`di_h-${breakpoint}`]:
										val !== undefined && val !== ''
											? val
											: '',
								});
							}}
							min={0}
							max={100}
							onReset={() =>
								onChange({
									[`di_h-${breakpoint}`]: getDefaultAttribute(
										`di_h-${breakpoint}`
									),
									isReset: true,
								})
							}
							initialPosition={getDefaultAttribute(
								`di_h-${breakpoint}`
							)}
						/>
					</>
				)}
			</div>
		</ToolbarPopover>
	);
};

export default Divider;
