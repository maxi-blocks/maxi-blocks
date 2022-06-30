const AccordionItemPanel = props => {
	const { children, className, isHidden } = props;

	return (
		<div
			className={className}
			hidden={isHidden}
			data-accordion-component='AccordionItemPanel'
		>
			{children}
		</div>
	);
};

export default AccordionItemPanel;
