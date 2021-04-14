const getCustomFormat = (typography, className, isHover = false) => {
	return (
		typography[`custom-formats${isHover ? '-hover' : ''}`][className] || {}
	);
};

export default getCustomFormat;
