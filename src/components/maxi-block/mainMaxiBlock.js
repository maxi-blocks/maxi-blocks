/**
 * WordPress dependencies
 */
import { useBlockProps } from '@wordpress/block-editor';
import { forwardRef, memo } from '@wordpress/element';

/**
 * Internal dependencies
 */
import BackgroundDisplayer from '@components/background-displayer';
import ContentLoader from '@components/content-loader';

/**
 * External dependencies
 */
import { isEmpty, isEqual } from 'lodash';
import DisabledMaxiBlock from './disabledMaxiBlock';

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
			isChild,
			isDisabled,
			showLoader,
			...props
		},
		ref
	) => {
		if (isSave)
			return (
				<TagName ref={ref} {...useBlockProps.save(props)}>
					{!isEmpty(anchorLink) && (
						<span
							id={anchorLink}
							className='maxi-block-anchor'
							key={`maxi-block-anchor-${anchorLink}`}
						/>
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
			<TagName uniqueid={uniqueID} {...useBlockProps({ ...props, ref })}>
				{isDisabled && !isChild && (
					<DisabledMaxiBlock
						key={`maxi-block-disabled__${uniqueID}`}
					/>
				)}
				{!isEmpty(anchorLink) && (
					<span
						id={anchorLink}
						className='maxi-block-anchor'
						key={`maxi-block-anchor-${anchorLink}`}
					/>
				)}
				{disableBackground && (
					<BackgroundDisplayer
						key={`maxi-background-displayer__${uniqueID}`}
						{...background}
					/>
				)}
				{showLoader && <ContentLoader overlay />}
				{children}
			</TagName>
		);
	}
);

const EditMainBlock = memo(MainBlock, (rawOldProps, rawNewProps) => {
	const propsCleaner = props => {
		const response = {};

		Object.entries(props).forEach(([key, value]) => {
			if (typeof value !== 'function') response[key] = value;
			if (typeof value !== 'object')
				response[key] = JSON.stringify(value);
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
