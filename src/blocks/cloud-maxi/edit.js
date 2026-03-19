/**
 * WordPress dependencies.
 */
import { useBlockProps } from '@wordpress/block-editor';
import { RawHTML, useRef, useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

/**
 * Internal dependencies.
 */
import MaxiModal from '@editor/library/modal';
import { withMaxiProps } from '@extensions/maxi-block';
import Popover from '@components/popover';
import Breadcrumbs from '@components/breadcrumbs';
import Mover from '@components/toolbar/components/mover';
import Help from '@components/toolbar/components/help';
import Delete from '@components/toolbar/components/delete';
import Dropdown from '@components/dropdown';
import Button from '@components/button';
import Icon from '@components/icon';
import { toolbarMoreSettings } from '@maxi-icons';

const CloudMore = ({ clientId, name, tooltipsHide }) => (
	<div className='toolbar-item toolbar-item__more-settings'>
		<Dropdown
			className='maxi-more-settings__settings-selector'
			contentClassName='maxi-more-settings__popover'
			position='right bottom'
			popoverProps={{ useShift: true }}
			renderToggle={({ onToggle }) => (
				<Button onClick={onToggle}>
					<Icon
						className='toolbar-item__icon'
						icon={toolbarMoreSettings}
					/>
				</Button>
			)}
			renderContent={() => (
				<div>
					<Delete
						clientId={clientId}
						blockName={name}
						tooltipsHide={tooltipsHide}
					/>
				</div>
			)}
		/>
	</div>
);

const CloudToolbar = ({ blockRef, clientId, name, isSelected }) => {
	const tooltipsHide =
		typeof window !== 'undefined'
			? window.maxiSettings?.hide_tooltips ?? false
			: false;

	const [anchorRef, setAnchorRef] = useState(blockRef.current);

	useEffect(() => {
		setAnchorRef(blockRef.current);
	}, [!!blockRef.current]);

	if (!isSelected || !anchorRef) return null;

	const label = __('Cloud Library Maxi', 'maxi-blocks');

	return (
		<Popover
			anchor={anchorRef}
			noArrow
			animate={false}
			focusOnMount={false}
			className='maxi-toolbar__popover'
			__unstableSlotName='block-toolbar'
			__unstableObserveElement={blockRef.current}
			observeBlockPosition={clientId}
			useAnimationFrame
			useShift
			shiftPadding={{ top: 22 }}
			shiftLimit={{ mainAxis: false }}
			position='top center'
		>
			<div className='toolbar-wrapper'>
				<div className='toolbar-block-custom-label'>
					{label.length > 30
						? `${label.substring(0, 30)}...`
						: label}
				</div>
				<Breadcrumbs />
				<Mover
					clientId={clientId}
					blockName={name}
					tooltipsHide={tooltipsHide}
				/>
				<Help tooltipsHide={tooltipsHide} />
				<CloudMore
					clientId={clientId}
					name={name}
					tooltipsHide={tooltipsHide}
				/>
			</div>
		</Popover>
	);
};

const edit = props => {
	const { attributes, clientId, maxiSetAttributes, isSelected, name } = props;
	const { content, openFirstTime, preview } = attributes;
	const blockRef = useRef(null);
	const blockProps = useBlockProps({ ref: blockRef });

	if (preview)
		return (
			<img
				// eslint-disable-next-line no-undef
				src={previews.library_preview}
				alt={__('Cloud library block preview', 'maxi-blocks')}
			/>
		);

	return (
		<>
			<CloudToolbar
				blockRef={blockRef}
				clientId={clientId}
				name={name}
				isSelected={isSelected}
			/>
			<div {...blockProps}>
				{isEmpty(content) && (
					<div className='maxi-block-library__placeholder'>
						<MaxiModal
							clientId={clientId}
							type='patterns'
							openFirstTime={openFirstTime}
							onOpen={obj => maxiSetAttributes(obj)}
							onSelect={obj => maxiSetAttributes(obj)}
							onRemove={obj => maxiSetAttributes(obj)}
							{...props}
						/>
					</div>
				)}
				{!isEmpty(content) && <RawHTML>{content}</RawHTML>}
			</div>
		</>
	);
};

export default withMaxiProps(edit);
