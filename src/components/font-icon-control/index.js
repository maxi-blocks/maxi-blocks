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
				</Fragment>
			)}
		</div>
	);
};

export default FontIconControl;
