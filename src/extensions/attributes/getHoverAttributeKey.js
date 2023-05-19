const getHoverAttributeKey = key => (key.includes('.h') ? key : `${key}.h`);

export default getHoverAttributeKey;
