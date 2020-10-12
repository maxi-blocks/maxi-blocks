/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Button } = wp.components;

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isObject } from 'lodash';

/**
 * Styles
 */
import './editor.scss';

/**
 * Component
 */
const FontIconControl = props => {
	const { className, icon, onChange } = props;

	const value = !isObject(icon) ? JSON.parse(icon) : icon;

	const classes = classnames('maxi-font-icon-picker', className);
	return (
		<div className={classes}>
			{!value.icon ? (
				<Button
					className='maxi-font-icon-picker__upload'
					onClick={() => {
						value.icon = 'Hi';
						onChange(JSON.stringify(value));
					}}
				>
					Set Icon
				</Button>
			) : (
				<div>
					<div className='maxi-font-icon-picker__icon'>
						Icon goes here!
					</div>
					<Button
						isDefault
						isLarge
						className='maxi-mediauploader-control__replace'
					>
						Replace
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
			)}
		</div>
	);
};

export default FontIconControl;
