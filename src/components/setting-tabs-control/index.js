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

	return (
		<div className={classes}>
			<div className={classesControl}>
				{items.map((item, i) => {
					if (item)
						return (
							<Button
								key={`maxi-tabs-control__button-${item.label}`}
								className='maxi-tabs-control__button'
								onClick={() => {
									setTab(i);

									if (callback) callback(item, i);
									if (item.callback) item.callback();
								}}
								aria-pressed={tab === i}
							>
								{item.label}
								{item.showNotification && (
									<span className='maxi-tabs-control__notification' />
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
