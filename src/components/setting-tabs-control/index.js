/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';

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
	const { items, disablePadding = false, className } = props;

	const [tab, setTab] = useState(0);

	const classes = classnames('maxi-settingstab-control', className);

	const classesControl = classnames(
		'maxi-tabs-control',
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
								key={`maxi-tabs-control__button-${i}`}
								className='maxi-tabs-control__button'
								onClick={() => setTab(i)}
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
								key={`maxi-tab-content-${i}`}
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
