/**
 * Internal dependencies
 */
import { getLastBreakpointValue } from '../../styles/utils';
import __experimentalGetFormatClassName from './getCurrentFormatClassName';

const getCustomFormatValue = ({
	typography,
	formatValue,
	prop,
	breakpoint,
}) => {
	const currentClassName = __experimentalGetFormatClassName(
		formatValue,
		'maxi-blocks/text-custom'
	);

	if (currentClassName)
		return getLastBreakpointValue(
			typography.customFormats[currentClassName],
			prop,
			breakpoint
		);

	return false;
};

export default getCustomFormatValue;
