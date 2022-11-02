/**
 * WordPress dependencies
 */
// import { useState } from '@wordpress/element';

/**
 * External dependencies
 */
import { kebabCase, isEmpty } from 'lodash';

const CopyPasteChildGroup = props => {
	const {
		attr,
		tab,
		label,
		selectedAttributes,
		specialPaste,
		organizedAttributes,
	} = props;

	const asArray = Object.entries(organizedAttributes[tab][label][attr]);
	const filtered = asArray.filter(([key, value]) => value);
	// Convert the key/value array back to an object:
	const organizedAttributesOptimize = Object.fromEntries(filtered);

	const paramsCallback = params => {
		props.parentCallback(params);
	};
	// console.log('attr', attr);
	return (
		<div className='child-content'>
			{Object.keys(organizedAttributesOptimize).map(value => {
				const uniqueValue = kebabCase(value);
				let checked;
				if (
					selectedAttributes[tab] &&
					selectedAttributes[tab][label] &&
					selectedAttributes[tab][label][attr] &&
					selectedAttributes[tab][label][attr][uniqueValue]
				) {
					checked = selectedAttributes[tab][label][attr][uniqueValue];
				} else {
					checked = !isEmpty(
						specialPaste[tab].filter(sp => {
							return (
								typeof sp === 'object' &&
								Object.values(sp).includes(attr)
							);
						})
					);
				}
				return (
					<div
						className='toolbar-item__copy-paste__popover__item'
						key={`copy-paste-${value}`}
					>
						<label name={uniqueValue}>
							<input
								type='checkbox'
								name={uniqueValue}
								id={uniqueValue}
								checked={checked}
								onChange={e =>
									paramsCallback({
										name: uniqueValue,
										attr,
										tab,
										checked: e.target.checked,
										group: label,
									})
								}
							/>
							<span>{value}</span>
						</label>
					</div>
				);
			})}
		</div>
	);
};

export default CopyPasteChildGroup;
