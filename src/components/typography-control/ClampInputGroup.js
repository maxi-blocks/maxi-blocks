/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import AdvancedNumberControl from '@components/advanced-number-control';

export const CLAMP_FIELDS = [
	{ key: 'min', label: __('Min', 'maxi-blocks') },
	{ key: 'preferred', label: __('Preferred', 'maxi-blocks') },
	{ key: 'max', label: __('Max', 'maxi-blocks') },
];

const ClampInputGroup = ({
	property = 'font-size',
	getClampAttr,
	handleClampChange,
	handleClampReset,
	minMaxSettings,
	getDefault,
}) => {
	return (
		<div className='maxi-typography-control__clamp-inputs'>
			{CLAMP_FIELDS.map(({ key, label }) => (
				<AdvancedNumberControl
					key={key}
					className={`maxi-typography-control__size-${key}`}
					label={label}
					enableUnit
					unit={getClampAttr(property, key, '-unit')}
					defaultUnit={getDefault(`${property}-${key}-unit`)}
					newStyle
					resetButtonClassName='maxi-reset-button--absolute'
					disableRange
					onChangeUnit={val =>
						handleClampChange(property, key, val, true)
					}
					placeholder={getClampAttr(property, key)}
					value={getClampAttr(property, key)}
					defaultValue={getDefault(`${property}-${key}`)}
					onChangeValue={val =>
						handleClampChange(property, key, val)
					}
					onReset={() => handleClampReset(property, key)}
					minMaxSettings={minMaxSettings}
					allowedUnits={['px', 'em', 'rem', 'vw', '%']}
				/>
			))}
		</div>
	);
};

export default ClampInputGroup;
