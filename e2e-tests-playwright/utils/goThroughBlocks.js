const goThroughBlocks = (blocks, callback) => {
	blocks.forEach(block => {
		callback(block);

		if (block.innerBlocks && block.innerBlocks.length > 0) {
			goThroughBlocks(block.innerBlocks, callback);
		}
	});
};

export default goThroughBlocks;
