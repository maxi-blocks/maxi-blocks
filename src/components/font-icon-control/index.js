/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Button } = wp.components;
const { useEffect, useState } = wp.element;

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
	const [solidIcons, setSolidIcons] = useState([]);

	const value = !isObject(icon) ? JSON.parse(icon) : icon;

	useEffect(async () => {
		const response = await fetch(
			'https://raw.githubusercontent.com/FortAwesome/Font-Awesome/master/metadata/icons.json'
		);

		if (!response.ok) {
			const message = `An error has occured: ${response.status}`;
			throw new Error(message);
		}

		const icons = await response.json();
		const solidIcons = [];
		const brandIcons = [];
		const regularIcons = [];

		Object.keys(icons).forEach(iconName => {
			if (icons[iconName].free.includes('brands')) {
				brandIcons.push(icons[iconName]);
			}

			if (icons[iconName].free.includes('solid')) {
				solidIcons.push(icons[iconName]);
			}

			if (icons[iconName].free.includes('regular')) {
				regularIcons.push(icons[iconName]);
			}
		});

		setSolidIcons(solidIcons);
	}, []);

	const classes = classnames('maxi-font-icon-control', className);
	return (
		<div className={classes}>
			{!value.icon ? (
				<Button
					className='maxi-font-icon-control__upload'
					onClick={() => {
						console.log('Button Clicked!');
					}}
				>
					<Modal />
				</Button>
			) : (
				<div>
					<div className='maxi-font-icon-control__icon'>
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
