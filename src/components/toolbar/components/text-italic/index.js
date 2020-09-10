/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { useSelect } = wp.data;
const { Icon, Button, Tooltip } = wp.components;

/**
 * Internal dependencies
 */
import {
	__experimentalIsFormatActive,
	__experimentalGetFormattedString,
} from '../../../../extensions/text/formats';

/**
 * Styles and icons
 */
import './editor.scss';
import { toolbarItalic } from '../../../../icons';

/**
 * TextItalic
 */
const TextItalic = props => {
	const { blockName, onChange, isList, formatValue } = props;

	const formatName = 'core/italic';

	const { isActive } = useSelect(() => {
		const isActive = __experimentalIsFormatActive(formatValue, formatName);

		return {
			isActive,
		};
	}, [__experimentalIsFormatActive, formatValue, formatName]);

	if (blockName !== 'maxi-blocks/text-maxi') return null;

	const onClick = () => {
		const newContent = __experimentalGetFormattedString({
			formatValue,
			formatName,
			isActive,
			isList,
		});

		onChange(newContent);
	};

	return (
		<Tooltip text={__('Italic', 'maxi-blocks')} position='bottom center'>
			<Button
				className='toolbar-item toolbar-item__italic'
				onClick={onClick}
				aria-pressed={isActive}
			>
				<Icon className='toolbar-item__icon' icon={toolbarItalic} />
			</Button>
		</Tooltip>
	);
};

export default TextItalic;
