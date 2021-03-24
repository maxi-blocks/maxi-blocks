/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { useSelect } = wp.data;
const { Icon, Button, Tooltip } = wp.components;
const { applyFormat, toHTMLString, removeFormat } = wp.richText;

/**
 * Internal dependencies
 */
import { formatActive } from '../../../../extensions/text/formats';
/**
 * Styles and icons
 */
import { toolbarCode } from '../../../../icons';

/**
 * TextFormatCode
 */
const TextFormatCode = props => {
	const { onChange, isList, getFormatValue } = props;

	const formatValue = getFormatValue();

	const formatName = 'core/code';

	const { isActive } = useSelect(() => {
		const isActive = formatActive(formatValue, formatName);

		return {
			isActive,
		};
	}, [formatActive, formatValue, formatName]);

	const onClick = () => {
		const newFormat = isActive
			? removeFormat(formatValue, formatName)
			: applyFormat(formatValue, {
					type: formatName,
					isActive,
			  });

		const newContent = toHTMLString({
			value: newFormat,
			multilineTag: (isList && 'li') || null,
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
				<Icon className='toolbar-item__icon' icon={toolbarCode} />
			</Button>
		</Tooltip>
	);
};

export default TextFormatCode;
