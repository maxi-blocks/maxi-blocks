/**
 * WordPress dependencies
 */
import { renderToString } from '@wordpress/element';

/**
 * Internal dependencies
 */
import getPresetItemClasses from './getPresetItemClasses';

/**
 * Styles
 */
import './editor.scss';

const PresetsControl = ({ items, onChange, className, prop }) => {
	return (
		<div className='maxi-presets-control'>
			{Object.entries(items).map(([key, value], index) => {
				return (
					<div
						className={getPresetItemClasses(
							'maxi-presets-control__item',
							prop,
							index
						)}
						key={key}
						onClick={() =>
							onChange(index + 1, renderToString(value))
						}
					>
						{value}
					</div>
				);
			})}
		</div>
	);
};

export default PresetsControl;
