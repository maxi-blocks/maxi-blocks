/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Button, SelectControl } = wp.components;
const { Fragment } = wp.element;

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isObject } from 'lodash';

/**
 * Internal dependencies
 */
import Modal from './modal';
import SizeControl from '../size-control';
import { getLastBreakpointValue } from '../../utils';
import ColorControl from '../color-control';

/**
 * Styles
 */
import './editor.scss';

/**
 * Component
 */
const FontIconControl = props => {
	const { className, icon, onChange, breakpoint } = props;

	const value = !isObject(icon) ? JSON.parse(icon) : icon;

	const classes = classnames('maxi-font-icon-control', className);
	return (
		<div className={classes}>
			{!value.icon ? (
				<Button className='maxi-font-icon-control__upload'>
					<Modal
						icon={icon}
						onChange={icon => {
							value.icon = icon;
							onChange(JSON.stringify(value));
						}}
					/>
				</Button>
			) : (
				<Fragment>
					<div className='maxi-font-icon-control__icon'>
						<i className={value.icon} />
					</div>
					<div className='maxi-font-icon-control__control-buttons'>
						<Button
							isDefault
							isLarge
							className='maxi-mediauploader-control__replace'
						>
							<Modal
								icon={icon}
								onChange={icon => {
									value.icon = icon;

									onChange(JSON.stringify(value));
								}}
								btnText='Replace'
							/>
						</Button>
						<Button
							isDefault
							isLarge
							className='maxi-mediauploader-control__remove'
							onClick={() => {
								value.icon = '';
								onChange(JSON.stringify(value));
							}}
						>
							Remove
						</Button>
					</div>
					<div className='maxi-font-icon-control__settings-container'>
						<ColorControl
							label={__('Icon', 'maxi-blocks')}
							color={getLastBreakpointValue(
								value,
								'color',
								breakpoint
							)}
							defaultColor='#fff'
							onChange={val => {
								value[breakpoint].color = val;
								onChange(JSON.stringify(value));
							}}
						/>

						<SelectControl
							label={__('Position', 'maxi-blocks')}
							value={value.position}
							options={[
								{
									label: __('Left', 'maxi-blocks'),
									value: 'left',
								},
								{
									label: __('Right', 'maxi-blocks'),
									value: 'right',
								},
							]}
							onChange={val => {
								value.position = val;
								onChange(JSON.stringify(value));
							}}
						/>

						<SizeControl
							label={__('Size', 'maxi-blocks')}
							unit={getLastBreakpointValue(
								value,
								'font-sizeUnit',
								breakpoint
							)}
							defaultUnit='px'
							onChangeUnit={val => {
								value[breakpoint]['font-sizeUnit'] = val;
								onChange(JSON.stringify(value));
							}}
							defaultValue=''
							value={getLastBreakpointValue(
								value,
								'font-size',
								breakpoint
							)}
							onChangeValue={val => {
								value[breakpoint]['font-size'] = val;
								onChange(JSON.stringify(value));
							}}
							minMaxSettings={{
								px: {
									min: 0,
									max: 99,
								},
								em: {
									min: 0,
									max: 99,
								},
								vw: {
									min: 0,
									max: 99,
								},
								'%': {
									min: 0,
									max: 100,
								},
							}}
						/>

						<SizeControl
							label={__('Spacing', 'maxi-blocks')}
							unit={getLastBreakpointValue(
								value,
								'spacing',
								breakpoint
							)}
							disableUnit
							defaultValue=''
							value={getLastBreakpointValue(
								value,
								'spacing',
								breakpoint
							)}
							onChangeValue={val => {
								value[breakpoint].spacing = val;
								onChange(JSON.stringify(value));
							}}
							min={0}
							max={99}
						/>
					</div>
				</Fragment>
			)}
		</div>
	);
};

export default FontIconControl;
