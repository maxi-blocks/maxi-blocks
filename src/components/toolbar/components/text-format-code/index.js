/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { Icon, Button, Tooltip } from '@wordpress/components';
import { applyFormat, toHTMLString, removeFormat } from '@wordpress/rich-text';

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
	const { onChange, isList, formatValue } = props;

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
