/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import CopyPasteChildGroup from './CopyPastChildGroup';

/**
 * External dependencies
 */
import { isEmpty, isEqual, kebabCase, omit } from 'lodash';

const CopyPasteGroup = props => {
	const {
		tab,
		label,
		organizedAttributes,
		currentOrganizedAttributes,
		selectedAttributes,
		specialPaste,
		handleSpecialPaste,
	} = props;
	const [isOpen, setIsOpen] = useState(false);
	const [isOpenChild, setIsOpenChild] = useState({});
	const [isUpdate, setIsUpdate] = useState(false);

	const normalizedLabel = kebabCase(label);

	const checkNestedCheckboxes = (attrType, tab, checked) => {
		handleSpecialPaste({
			attr: Object.keys(
				omit(organizedAttributes[tab][attrType], 'group')
			),
			tab,
			group: attrType,
			checked,
		});
	};

	const isGroupCheckboxChecked = (
		tabSpecialPaste,
		labelOrganizedAttributes,
		label
	) => {
		const count = Object.keys(labelOrganizedAttributes).length - 1;
		const currentCount = tabSpecialPaste.filter(item =>
			Object.keys(item).includes(label)
		).length;
		return currentCount === count;
	};

	const openChildMenu = ({ id, isOpenMenu }) => {
		const newIsOpenChild = isOpenChild;
		newIsOpenChild[id] = !isOpenMenu;
		setIsOpenChild(newIsOpenChild);
		setIsUpdate(!isUpdate);
	};

	const handleChangeCallback = ({
		name,
		empty,
		attr,
		tab,
		checked,
		checkedParent,
		group,
	}) => {
		handleSpecialPaste({
			name,
			empty,
			attr,
			tab,
			checkedAttribute: checked,
			checked: checkedParent,
			group,
		});
	};

	const emptyAttributes = attr => {
		const asArray = Object.entries(organizedAttributes[tab][label][attr]);
		const filtered = asArray.filter(
			([key, value]) =>
				value !== currentOrganizedAttributes[tab][label][attr][key]
		);
		const organizedAttributesOptimize = Object.fromEntries(filtered);

		let empty;
		if (
			selectedAttributes[tab] &&
			selectedAttributes[tab][label] &&
			selectedAttributes[tab][label][attr]
		) {
			empty = Object.keys(organizedAttributesOptimize).filter(
				value => !selectedAttributes[tab][label][attr][kebabCase(value)]
			);
		} else {
			empty = Object.keys(organizedAttributesOptimize).filter(value =>
				kebabCase(value)
			);
		}

		return empty;
	};

	return (
		<>
			<div
				className='toolbar-item__copy-paste__popover__item toolbar-item__copy-paste__popover__item__group'
				onClick={e => {
					if (e.target.nodeName !== 'INPUT') setIsOpen(!isOpen);
				}}
			>
				<input
					type='checkbox'
					name={normalizedLabel}
					id={normalizedLabel}
					checked={isGroupCheckboxChecked(
						specialPaste[tab],
						organizedAttributes[tab][label],
						label
					)}
					onChange={e =>
						checkNestedCheckboxes(label, tab, e.target.checked)
					}
				/>
				<span onClick={e => e.preventDefault()}>
					<label htmlFor={normalizedLabel}>{label}</label>
				</span>
				<span
					onClick={e => setIsOpen(!isOpen)}
					aria-expanded={isOpen}
					className='copy-paste__group-icon'
				/>
			</div>
			{isOpen &&
				Object.keys(organizedAttributes[tab][label]).map(attr => {
					// To prevent the group checkbox triggering from nested items
					const uniqueAttr = kebabCase(
						attr === label ? `${label}-nested` : attr
					);
					const id = `${tab}-${uniqueAttr}`;
					const isOpenMenu =
						typeof isOpenChild[id] !== 'undefined'
							? isOpenChild[id]
							: false;

					const checked = !isEmpty(
						specialPaste[tab].filter(sp => {
							return (
								typeof sp === 'object' &&
								Object.values(sp).includes(attr)
							);
						})
					);
					return (
						!isEqual(
							currentOrganizedAttributes[tab][label][attr],
							organizedAttributes[tab][label][attr]
						) && (
							<div
								key={`copy-paste-${id}`}
								className='toolbar-item__copy-paste__wrapper toolbar-item__copy-paste__popover__item'
							>
								<div
									className='toolbar-item__copy-paste__item'
									data-copy_paste_group={kebabCase(label)}
									onClick={e => {
										if (e.target.nodeName !== 'INPUT')
											openChildMenu({ id, isOpenMenu });
									}}
								>
									<input
										type='checkbox'
										name={uniqueAttr}
										id={uniqueAttr}
										checked={checked}
										onChange={e =>
											handleSpecialPaste({
												empty: emptyAttributes(attr),
												attr,
												tab,
												checked: e.target.checked,
												group: label,
											})
										}
									/>
									<span>{attr}</span>
									<span
										onClick={e =>
											openChildMenu({ id, isOpenMenu })
										}
										aria-expanded={isOpenMenu}
										className='copy-paste__group-icon'
									/>
								</div>
								{isOpenMenu && (
									<CopyPasteChildGroup
										parentCallback={handleChangeCallback}
										attr={attr}
										checkedParent={checked}
										label={label}
										tab={tab}
										selectedAttributes={selectedAttributes}
										specialPaste={specialPaste}
										organizedAttributes={
											organizedAttributes
										}
										currentOrganizedAttributes={
											currentOrganizedAttributes
										}
									/>
								)}
							</div>
						)
					);
				})}
		</>
	);
};

export default CopyPasteGroup;
