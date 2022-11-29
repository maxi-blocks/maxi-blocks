const shouldBorderTargetBlockUpdate = ({ blockAttributes, prefix = '' }) =>
	Object.entries(blockAttributes).some(
		([key, value]) =>
			key.includes(`${prefix}border-style`) && value === 'none'
	);

export default shouldBorderTargetBlockUpdate;
