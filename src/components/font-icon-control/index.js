/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Button } = wp.components;
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
						<SizeControl
							label={__('Size', 'maxi-blocks')}
							unit={value[breakpoint]['font-sizeUnit']}
							onChangeUnit={val => {
								value[breakpoint]['font-sizeUnit'] = val;
								onChange(JSON.stringify(value));
							}}
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
					</div>
				</Fragment>
			)}
		</div>
	);
};

export default FontIconControl;
