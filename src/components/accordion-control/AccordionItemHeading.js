const AccordionItemHeading = props => {
	const { children, className } = props;

	return (
		<div
			className={className}
			data-accordion-component='AccordionItemHeading'
		>
			{children}
		</div>
	);
};

export default AccordionItemHeading;
