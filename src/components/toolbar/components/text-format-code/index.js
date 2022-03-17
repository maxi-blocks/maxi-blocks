/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { Tooltip } from '@wordpress/components';
import {
	applyFormat,
	toHTMLString,
	removeFormat,
	isCollapsed,
} from '@wordpress/rich-text';

/**
 * Internal dependencies
 */
import Button from '../../../button';
import Icon from '../../../icon';
import {
	formatActive,
	withFormatValue,
} from '../../../../extensions/text/formats';

/**
 * External dependencies
 */
import { isNil } from 'lodash';

/**
 * Styles and icons
 */
import { toolbarCode } from '../../../../icons';

/**
 * TextFormatCode
 */
const TextFormatCode = withFormatValue(props => {
	const { onChange, isList, formatValue } = props;

	const formatName = 'core/code';

	const { isActive } = useSelect(() => {
		const isActive = formatActive(formatValue, formatName);

		return {
			isActive,
		};
	}, [formatActive, formatValue, formatName]);

	const onClick = () => {
		const { start, end } = formatValue;
		const newFormatValue = { ...formatValue };

		if (isNil(start) || isNil(end) || isCollapsed(formatValue)) {
			// eslint-disable-next-line @wordpress/no-global-get-selection, @wordpress/no-unguarded-get-range-at
			const { startOffset, endOffset } = window
				.getSelection()
				.getRangeAt(0);

			newFormatValue.start = startOffset;
			newFormatValue.end = endOffset;
		}

		if (start === end) {
			newFormatValue.start = 0;
			newFormatValue.end = formatValue.formats.length;
		}

		const newFormat = isActive
			? removeFormat(newFormatValue, formatName)
			: applyFormat(newFormatValue, {
					type: formatName,
					isActive,
			  });

		const newContent = toHTMLString({
			value: newFormat,
			multilineTag: isList ? 'li' : null,
			preserveWhiteSpace: false,
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
});

export default TextFormatCode;
