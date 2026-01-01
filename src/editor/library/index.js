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
		useSCStyles,
		isMaxiProActive,
		isMaxiProExpired,
		onClickConnect,
		onClickConnectCode,
		userName,
		onLogOut,
		layerOrder,
		showNotValidEmail,
		showAuthError,
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

	/**
	 * Get SC styles option from cookie
	 *
	 * @returns {boolean} - The SC styles option value
	 */
	const getCookieSCStylesOption = () => {
		const cookies = document.cookie.split('; ');
		const scStylesCookie = cookies.find(cookie =>
			cookie.startsWith('maxi_use_sc_styles=')
		);
		return scStylesCookie ? scStylesCookie.split('=')[1] === 'true' : false;
	};

	/**
	 * Set SC styles option in cookie
	 *
	 * @param {boolean} value - The value to set
	 */
	const setCookieSCStylesOption = value => {
		const expirationDate = new Date();
		expirationDate.setFullYear(expirationDate.getFullYear() + 1);
		document.cookie = `maxi_use_sc_styles=${value}; expires=${expirationDate.toUTCString()}; path=/`;
	};

	const [localUseSCStyles, setLocalUseSCStyles] = useState(
		useSCStyles ?? getCookieSCStylesOption()
	);

	const handleUseSCStylesChange = val => {
		setLocalUseSCStyles(val);
		setCookieSCStylesOption(val);
	};

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
				useSCStyles={localUseSCStyles}
				isMaxiProActive={isMaxiProActive}
				isMaxiProExpired={isMaxiProExpired}
				onClickConnect={onClickConnect}
				onClickConnectCode={onClickConnectCode}
				userName={userName}
				onLogOut={onLogOut}
				showNotValidEmail={showNotValidEmail}
				showAuthError={showAuthError}
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
				gutenbergCode={gutenbergCode}
				prefix={prefix}
				isPro={isPro}
				isBeta={isBeta}
				userName={userName}
				isMaxiProActive={isMaxiProActive}
				onClickConnect={onClickConnect}
				layerOrder={layerOrder}
				isInserting={isInserting}
				onInsert={onInsert}
				useSCStyles={localUseSCStyles}
				onUseSCStylesChange={handleUseSCStylesChange}
			/>
		</Modal>
	);
};

export default CloudLibrary;
