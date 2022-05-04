/**
 * WordPress dependencies
 */
import { useBlockProps } from '@wordpress/block-editor';
import { forwardRef, memo } from '@wordpress/element';

/**
 * Internal dependencies
 */
import BackgroundDisplayer from '../background-displayer';

/**
 * External dependencies
 */
import { isEmpty, isEqual } from 'lodash';

const MainBlock = forwardRef(
	(
		{
			tagName: TagName = 'div',
			children,
			background,
			disableBackground,
			uniqueID,
			isSave,
			anchorLink,
			...props
		},
		ref
	) => {
		if (isSave)
			return (
				<TagName ref={ref} {...useBlockProps.save(props)}>
					{!isEmpty(anchorLink) && (
						<span id={anchorLink} className='maxi-block-anchor' />
					)}
					{disableBackground && (
						<BackgroundDisplayer
							key={`maxi-background-displayer__${uniqueID}`}
							isSave
							{...background}
						/>
					)}
					{children}
				</TagName>
			);

		return (
			// eslint-disable-next-line react-hooks/rules-of-hooks
			<TagName {...useBlockProps({ ...props, ref })}>
				{!isEmpty(anchorLink) && <span id={anchorLink} />}
				{disableBackground && (
					<BackgroundDisplayer
						key={`maxi-background-displayer__${uniqueID}`}
						{...background}
					/>
				)}
				{children}
			</TagName>
		);
	}
);

const EditMainBlock = memo(MainBlock, (rawOldProps, rawNewProps) => {
	const propsCleaner = props => {
		const response = {};

		Object.entries(props).forEach(([key, value]) => {
			if (typeof value !== 'function' && typeof value !== 'object')
				response[key] = value;
		});

		return response;
	};

	const oldProps = propsCleaner(rawOldProps);
	const newProps = propsCleaner(rawNewProps);

	return isEqual(oldProps, newProps);
});

const MainMaxiBlock = forwardRef(({ isSave, ...restProps }, ref) => {
	if (isSave) return <MainBlock isSave {...restProps} />;

	return <EditMainBlock ref={ref} {...restProps} />;
});

export default MainMaxiBlock;
