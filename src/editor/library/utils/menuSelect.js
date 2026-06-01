const isMenuSelectItemRefined = (currentRefinement, item, value) =>
	Boolean(item?.isRefined || currentRefinement === value);

export default isMenuSelectItemRefined;
