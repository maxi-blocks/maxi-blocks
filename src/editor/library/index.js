/* eslint-disable import/no-cycle */
/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';
import { Modal } from '@wordpress/components';
import { useState } from '@wordpress/element';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import LibraryToolbar from './toolbar';
import LibraryContainer from './container';

/**
 * Styles
 */
import './editor.scss';

/**
 * Component
 *
 * @param {string} cloudType Type of the data to get from the Cloud, values: patterns, svg, sc
 */
const CloudLibrary = props => {
	const {
		onClose,
		className,
		cloudType,
		blockStyle: rawBlockStyle,
		onSelect,
		url: rawURL,
		title: rowTitle,
		cost: rawCost,
		toneUrl: rawToneUrl,
		cardId,
		isPro: rawIsPro,
		isBeta: rawIsBeta,
		prefix = '',
		gutenbergCode: rawGutenbergCode,
		isSwapChecked,
		isMaxiProActive,
		isMaxiProExpired,
		onClickConnect,
		userName,
		onLogOut,
		layerOrder,
		showNotValidEmail,
	} = props;

	const [type, setType] = useState(cloudType);
	const [url, setUrl] = useState(rawURL);
	const [blockStyle, setBlockStyle] = useState(rawBlockStyle);
	const [toneUrl, setToneUrl] = useState(rawToneUrl);
	const [gutenbergCode, setGutenbergCode] = useState(rawGutenbergCode);
	const [isBeta, setIsBeta] = useState(rawIsBeta);
	const [isPro, setIsPro] = useState(rawIsPro);
	const [title, setTitle] = useState(rowTitle);
	const [cost, setCost] = useState(rawCost);

	const [isInserting, setIsInserting] = useState(false);
	const onInsert = () => setIsInserting(true);

	const classes = classnames('maxi-library-modal', className);

	return (
		<Modal
			title={__('Cloud library Maxi', 'maxi-blocks')}
			className={classes}
			shouldCloseOnEsc
			shouldCloseOnClickOutside={false}
			onRequestClose={onClose}
		>
			<LibraryToolbar
				type={type}
				onChange={type => setType(type)}
				cardId={cardId}
				title={title}
				cost={cost}
				toneUrl={toneUrl}
				onRequestClose={onClose}
				isPro={isPro}
				isBeta={isBeta}
				gutenbergCode={gutenbergCode}
				onSelect={onSelect}
				onInsert={onInsert}
				isSwapChecked={isSwapChecked}
				isMaxiProActive={isMaxiProActive}
				isMaxiProExpired={isMaxiProExpired}
				onClickConnect={onClickConnect}
				userName={userName}
				onLogOut={onLogOut}
				showNotValidEmail={showNotValidEmail}
				onChangeTone={hit => {
					const {
						demo_url: newUrl,
						light_or_dark: [newBlockStyle],
						link_to_related: newToneUrl,
						gutenberg_code: newGutenbergCode,
						post_title: newTitle,
					} = hit;

					setUrl(newUrl);
					setBlockStyle(newBlockStyle);
					setToneUrl(newToneUrl);
					setGutenbergCode(newGutenbergCode);
					setIsBeta(hit.post_tag?.includes('Beta'));
					setIsPro(hit.cost?.[0] === 'Pro');
					setTitle(newTitle);
					setCost(hit.cost?.[0]);
				}}
			/>
			<LibraryContainer
				type={type}
				onRequestClose={onClose}
				blockStyle={blockStyle}
				onSelect={onSelect}
				url={url}
				title={title}
				prefix={prefix}
				isPro={isPro}
				isBeta={isBeta}
				userName={userName}
				isMaxiProActive={isMaxiProActive}
				onClickConnect={onClickConnect}
				layerOrder={layerOrder}
				isInserting={isInserting}
				onInsert={onInsert}
			/>
		</Modal>
	);
};

export default CloudLibrary;
