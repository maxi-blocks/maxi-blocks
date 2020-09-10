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
import { toolbarItalic } from '../../../../icons';

/**
 * TextFormatUnderline
 */
const TextFormatUnderline = props => {
	const { onChange, isList, formatValue } = props;

	const formatName = 'core/underline';

	const { isActive } = useSelect(() => {
		const isActive = __experimentalIsFormatActive(formatValue, formatName);

		return {
			isActive,
		};
	}, [__experimentalIsFormatActive, formatValue, formatName]);

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
		<Tooltip text={__('Underline', 'maxi-blocks')} position='bottom center'>
			<Button
				className='toolbar-item toolbar-item__underline'
				onClick={onClick}
				aria-pressed={isActive}
			>
				<Icon className='toolbar-item__icon' icon={toolbarItalic} />
			</Button>
		</Tooltip>
	);
};

export default TextFormatUnderline;
