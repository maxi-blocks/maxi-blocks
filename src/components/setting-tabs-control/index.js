/**
 * WordPress dependencies
 */
import { useState, useEffect } from '@wordpress/element';
import { getBlockAttributes } from '@wordpress/blocks';
import { select } from '@wordpress/data';

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
import { getPropsFromChildren } from '../../extensions/styles';

/**
 * Component
 */
const getIsActiveTab = (attributes, breakpoint) => {
	const { getBlock, getSelectedBlockClientId } = select('core/block-editor');

	const block = getBlock(getSelectedBlockClientId());
	const { name, attributes: currentAttributes } = block;

	console.log(`block: ${name}`);

	const defaultAttributes = getBlockAttributes(name);

	const excludedAttributes = [
		'parentBlockStyle',
		'isFirstOnHierarchy',
		'uniqueID',
	];

	return !attributes.every(attribute => {
		if (excludedAttributes.includes(attribute)) return true;
		if (!(attribute in defaultAttributes)) return true;
		if (breakpoint) {
			if (
				attribute.lastIndexOf(`-${breakpoint}`) ===
				attribute.length - `-${breakpoint}`.length
			)
				return (
					currentAttributes[attribute] ===
					defaultAttributes[attribute]
				);
		} else
			return (
				currentAttributes[attribute] === defaultAttributes[attribute]
			);

		return true;
	});
};

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
								className={classnames(
									'maxi-tabs-control__button',
									getIsActiveTab(
										getPropsFromChildren(item),
										item.breakpoint
									) &&
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
