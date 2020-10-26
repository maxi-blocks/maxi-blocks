/**
 * WordPress dependencies
 */
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
							className='maxi-font-icon-picker__replace'
						>
							<Modal
								icon={iconClassName}
								onChange={iconClassName => {
									onChange(iconClassName);
								}}
								btnText='Replace'
							/>
						</Button>
						<Button
							isDefault
							isLarge
							className='maxi-font-icon-picker__remove'
							onClick={() => {
								onChange('');
							}}
						>
							Remove
						</Button>
					</div>
				</Fragment>
			)}
		</div>
	);
};

export default FontIconPicker;
