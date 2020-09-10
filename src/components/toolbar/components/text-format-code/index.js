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
 * TextFormatCode
 */
const TextFormatCode = props => {
	const { onChange, isList, formatValue } = props;

	const formatName = 'core/code';

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
		<Tooltip text={__('Code', 'maxi-blocks')} position='bottom center'>
			<Button
				className='toolbar-item toolbar-item__code'
				onClick={onClick}
				aria-pressed={isActive}
			>
				<Icon className='toolbar-item__icon' icon={toolbarItalic} />
			</Button>
		</Tooltip>
	);
};

export default TextFormatCode;
