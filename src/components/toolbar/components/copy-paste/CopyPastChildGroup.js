/**
 * External dependencies
 */
import { kebabCase, isEmpty } from 'lodash';

const CopyPasteChildGroup = props => {
	// const [attributesArray, setAttributesArray] = useState([]);
	const {
		attr,
		checkedParent,
		tab,
		label,
		selectedAttributes,
		specialPaste,
		organizedAttributes,
		currentOrganizedAttributes,
	} = props;

	const asArray = Object.entries(organizedAttributes[tab][label][attr]);
	const filtered = asArray.filter(
		([key, value]) =>
			value !== currentOrganizedAttributes[tab][label][attr][key]
	);
	// Convert the key/value array back to an object:
	const organizedAttributesOptimize = Object.fromEntries(filtered);

	const paramsCallback = params => {
		props.parentCallback(params);
	};
	const emptyAttributes = name => {
		let empty;
		if (
			selectedAttributes[tab] &&
			selectedAttributes[tab][label] &&
			selectedAttributes[tab][label][attr]
		) {
			empty = Object.keys(organizedAttributesOptimize).filter(
				value =>
					!selectedAttributes[tab][label][attr][kebabCase(value)] &&
					kebabCase(value) !== name
			);
		} else {
			empty = Object.keys(organizedAttributesOptimize).filter(
				value => kebabCase(value) !== name
			);
		}
		return empty;
	};
	const onchangeCheckedParent = checked => {
		if (
			!checked &&
			selectedAttributes[tab] &&
			selectedAttributes[tab][label] &&
			selectedAttributes[tab][label][attr]
		) {
			const checked = !Object.keys(
				selectedAttributes[tab][label][attr]
			).every(v => !selectedAttributes[tab][label][attr][v]);
			return (checkedParent === true) === checked ? undefined : checked;
		}
		return checkedParent === true ? undefined : true;
	};

	return (
		<div className='toolbar-item__copy-paste__content'>
			{Object.keys(organizedAttributesOptimize).map(value => {
				const uniqueValue = kebabCase(value);

				let checked;
				if (
					selectedAttributes[tab] &&
					selectedAttributes[tab][label] &&
					selectedAttributes[tab][label][attr] &&
					typeof selectedAttributes[tab][label][attr][uniqueValue] ===
						'boolean'
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
								onChange={e => {
									return paramsCallback({
										empty: emptyAttributes(
											uniqueValue,
											e.target.checked
										),
										name: uniqueValue,
										attr,
										tab,
										checked: e.target.checked,
										checkedParent: onchangeCheckedParent(
											e.target.checked
										),
										group: label,
									});
								}}
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
