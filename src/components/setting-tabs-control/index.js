/**
 * WordPress dependencies
 */
import { useState, useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import Button from '../button';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Styles and icons
 */
import './editor.scss';

/**
 * Component
 */
const SettingTabsControl = props => {
	const {
		items,
		disablePadding = false,
		className,
		forceTab,
		returnValue,
		callback,
		target,
		active,
	} = props;

	const [tab, setTab] = useState(0);

	useEffect(() => {
		if (forceTab || forceTab === 0) {
			setTab(forceTab);
		}
	}, [forceTab]);

	useEffect(() => {
		if (returnValue) returnValue(items[tab]);
	}, [tab]);

	const classes = classnames('maxi-settingstab-control', className);

	const classesControl = classnames(
		'maxi-tabs-control',
		target && `maxi-tabs-control__${target}`,
		!disablePadding ? 'maxi-tabs-control--disable-padding' : null
	);

	const classesContent = classnames(
		'maxi-tabs-content',
		disablePadding ? 'maxi-tabs-content--disable-padding' : null
	);

	console.log('final active');
	console.log(active);

	return (
		<div className={classes}>
			<div className={classesControl}>
				{items.map((item, i) => {
					if (item)
						return (
							<Button
								key={`maxi-tabs-control__button-${item.label}`}
								className={classnames(
									'maxi-tabs-control__button',
									active?.includes(item.label) &&
										'maxi-button-group-control__option--active'
								)}
								onClick={() => {
									setTab(i);

									if (callback) callback(item, i);
									if (item.callback) item.callback();
								}}
								aria-pressed={tab === i}
							>
								{item.label}
								{item.showNotification && (
									<svg
										className='maxi-tabs-control__notification'
										xmlns='http://www.w3.org/2000/svg'
										viewBox='0 0 9 9'
									>
										<path
											fill='#ff4a17'
											d='M4.5 0H9v4.5A4.5 4.5 0 0 1 4.5 9 4.5 4.5 0 0 1 0 4.5 4.5 4.5 0 0 1 4.5 0Z'
										/>
									</svg>
								)}
							</Button>
						);

					return null;
				})}
			</div>
			<div className={classesContent}>
				{items.map((item, i) => {
					if (item && i === tab) {
						const classesItemContent = classnames(
							'maxi-tab-content',
							tab === i ? 'maxi-tab-content--selected' : ''
						);

						return (
							<div
								key={`maxi-tab-content-${item.label}`}
								className={classesItemContent}
							>
								{item.content}
							</div>
						);
					}

					return null;
				})}
			</div>
		</div>
	);
};

export default SettingTabsControl;
