/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { TextControl } from '../../../../components';

const SvgAltControl = props => {
	const { altTitle, altDescription, onChange } = props;
	return (
		<>
			<TextControl
				label={__('Alt title', 'maxi-blocks')}
				value={altTitle}
				onChange={altTitle => onChange({ altTitle })}
			/>
			<TextControl
				label={__('Alt description', 'maxi-blocks')}
				value={altDescription}
				onChange={altDescription => onChange({ altDescription })}
			/>
		</>
	);
};

export default SvgAltControl;
