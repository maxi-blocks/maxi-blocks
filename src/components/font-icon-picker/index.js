/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
const { Button } = wp.components;
const { Fragment } = wp.element;

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import MaxiModalIcon from './modal';

/**
 * Styles
 */
import './editor.scss';

/**
 * Component
 */
const FontIconPicker = props => {
	const { className, iconClassName, onChange } = props;

	const classes = classnames('maxi-font-icon-picker', className);
	return (
		<div className={classes}>
			{!iconClassName ? (
				<div className='maxi-font-icon-picker__upload'>
					<MaxiModalIcon
						onChange={iconClassName => {
							onChange(iconClassName);
						}}
					/>
				</div>
			) : (
				<Fragment>
					<div className='maxi-font-icon-picker__icon'>
						<i className={iconClassName} />
					</div>
					<div className='maxi-font-icon-picker__control-buttons'>
						<div className='maxi-font-icon-picker__control-buttons__replace'>
							<MaxiModalIcon
								icon={iconClassName}
								onChange={iconClassName => {
									onChange(iconClassName);
								}}
								btnText={__('Replace Icon', 'maxi-blocks')}
							/>
						</div>
						<div className='maxi-font-icon-picker__control-buttons__remove'>
							<Button
								onClick={() => {
									onChange('');
								}}
							>
								{__('Remove Icon', 'maxi-blocks')}
							</Button>
						</div>
					</div>
				</Fragment>
			)}
		</div>
	);
};

export default FontIconPicker;
