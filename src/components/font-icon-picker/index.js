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

/**
 * Internal dependencies
 */
import Modal from './modal';

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
				<Button className='maxi-font-icon-picker__upload'>
					<Modal
						onChange={iconClassName => {
							onChange(iconClassName);
						}}
					/>
				</Button>
			) : (
				<Fragment>
					<div className='maxi-font-icon-picker__icon'>
						<i className={iconClassName} />
					</div>
					<div className='maxi-font-icon-picker__control-buttons'>
						<Button
							isDefault
							isLarge
							className='maxi-font-icon-picker__control-buttons__replace'
						>
							<Modal
								icon={iconClassName}
								onChange={iconClassName => {
									onChange(iconClassName);
								}}
								btnText={__('Replace Icon', 'maxi-blocks')}
							/>
						</Button>
						<Button
							isDefault
							isLarge
							className='maxi-font-icon-picker__control-buttons__remove'
							onClick={() => {
								onChange('');
							}}
						>
							{__('Remove Icon', 'maxi-blocks')}
						</Button>
					</div>
				</Fragment>
			)}
		</div>
	);
};

export default FontIconPicker;
