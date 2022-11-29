/**
 * In case if target block some border-style attribute equal `none`,
 * target block should be updated to have correct border styles
 */
const shouldBorderTargetBlockUpdate = ({ blockAttributes, prefix = '' }) =>
	Object.entries(blockAttributes).some(
		([key, value]) =>
			key.includes(`${prefix}border-style`) && value === 'none'
	);

export default shouldBorderTargetBlockUpdate;
