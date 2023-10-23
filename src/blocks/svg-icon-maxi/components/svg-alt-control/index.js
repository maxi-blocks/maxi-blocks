/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * External dependencies
 */
import loadable from '@loadable/component';

/**
 * Internal dependencies
 */
const TextControl = loadable(() =>
	import('../../../../components/text-control')
);

const SvgAltControl = props => {
	const { altTitle, altDescription, onChange } = props;
	return (
		<>
			<TextControl
				label={__('Alt title', 'maxi-blocks')}
				value={altTitle}
				newStyle
				onChange={altTitle => onChange({ altTitle })}
			/>
			<TextControl
				label={__('Alt description', 'maxi-blocks')}
				value={altDescription}
				newStyle
				onChange={altDescription => onChange({ altDescription })}
			/>
		</>
	);
};

export default SvgAltControl;
