const getHoverAttributeKey = key =>
	key.includes('-hover') ? key : `${key}-hover`;

export default getHoverAttributeKey;
