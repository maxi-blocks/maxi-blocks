/**
 * Internal dependencies
 */
import { MaxiBlock, getMaxiBlockAttributes } from '@components/maxi-block';

/**
 * External dependencies
 */
import classnames from 'classnames';

const NAME = 'Divider orientation';

/**
 * Declares the legacy `lineOrientation` attribute so Gutenberg can
 * parse it from old block comments during deprecation validation.
 */
const attributes = () => ({
	lineOrientation: { type: 'string' },
});

/**
 * Old save that reads the legacy camelCase `lineOrientation` attribute.
 * Gutenberg validates stored HTML against this to identify blocks
 * saved before the breakpoint-aware orientation was introduced.
 */
const oldSave = props => {
	const { attributes: attr } = props;
	const { lineOrientation, ariaLabels = {} } = attr;

	const name = 'maxi-blocks/divider-maxi';

	const classes = classnames(
		lineOrientation === 'vertical'
			? 'maxi-divider-block--vertical'
			: 'maxi-divider-block--horizontal'
	);

	return (
		<MaxiBlock.save
			classes={classes}
			{...getMaxiBlockAttributes({ ...props, name })}
			aria-label={ariaLabels.canvas}
		>
			{attr['divider-border-style'] !== 'none' && (
				<hr
					className='maxi-divider-block__divider'
					aria-label={ariaLabels.divider}
				/>
			)}
		</MaxiBlock.save>
	);
};

/**
 * Any block reaching this deprecated entry was saved with the old
 * `lineOrientation` save — it always needs the migration path so the
 * new breakpoint-aware save takes over on the next persist.
 */
const isEligible = () => true;

/**
 * Copies the legacy `lineOrientation` into `line-orientation-general`
 * so the new save (and editor) both resolve from the same source.
 * Blocks where `lineOrientation` was never serialized are still
 * re-saved correctly because `line-orientation-general` already holds
 * the value the user set through the inspector.
 *
 * @param {Object} newAttributes Merged attributes from the deprecated parser.
 * @return {Object} Attributes with the legacy value promoted.
 */
const migrate = newAttributes => {
	const { lineOrientation } = newAttributes;

	if (lineOrientation) {
		newAttributes['line-orientation-general'] = lineOrientation;
		delete newAttributes.lineOrientation;
	}

	return newAttributes;
};

export default {
	name: NAME,
	isEligible,
	attributes,
	migrate,
	save: oldSave,
};
