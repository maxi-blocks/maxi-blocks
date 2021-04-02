/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { Fragment  } from '@wordpress/element';
import { Tooltip } from '@wordpress/components';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty, isNil, has, filter, flattenDeep, forIn } from 'lodash';

/**
 * icons
 */
import { toolbarDelete } from '../../icons';

/**
 * Component
 */
const ShowTimeline = props => {
	const { onChange } = props;

	const removeTimeline = (type, time) => {
		if (has(props['motion-time-line'], time)) {
			const result = filter(props['motion-time-line'][time], o => {
				return o.type !== type;
			});

			onChange({
				'motion-time-line': {
					...props['motion-time-line'],
					[time]: [...result],
				},
			});

			if (isEmpty(result)) {
				const newTimeline = { ...props['motion-time-line'] };
				delete newTimeline[time];

				onChange({
					'motion-time-line': { ...newTimeline },
				});
			}
		}

		const res = flattenDeep(Object.entries(props['motion-time-line']));

		onChange({
			'motion-active-time-line-time': +res[0],
			'motion-active-time-line-index': 0,
		});
	};

	const typeCount = {
		move: 0,
		scale: 0,
		skew: 0,
		rotate: 0,
		opacity: 0,
		blur: 0,
	};
	forIn(
		flattenDeep(Object.values(props['motion-time-line'] || {})),
		value => {
			if (value.type === 'move') typeCount.move++;
			if (value.type === 'scale') typeCount.scale++;
			if (value.type === 'skew') typeCount.skew++;
			if (value.type === 'rotate') typeCount.rotate++;
			if (value.type === 'opacity') typeCount.opacity++;
			if (value.type === 'blur') typeCount.blur++;
		}
	);

	return (
		<div className='maxi-motion-control__timeline'>
			{isEmpty(props['motion-time-line']) && (
				<div className='maxi-motion-control__timeline__no-effects'>
					<p>
						{__(
							'Please enter your first interaction effect',
							'maxi-blocks'
						)}
					</p>
				</div>
			)}
			{props['motion-time-line'] &&
				Object.entries(props['motion-time-line']).map(
					([key, value], i, arr) => {
						const prevValue = !isNil(arr[i - 1])
							? arr[i - 1][0]
							: 0;
						return (
							<Fragment key={`maxi-motion-time-line-${i}`}>
								<div
									className='maxi-motion-control__timeline__space'
									style={{
										flexGrow: `${parseFloat(
											(Number(key) - Number(prevValue)) /
												100
										)}`,
									}}
								/>
								<div className='maxi-motion-control__timeline__group'>
									{value.map((item, i) => (
										<div
											key={`maxi-motion-control__timeline__group__item-${i}`}
											className={classnames(
												'maxi-motion-control__timeline__group__item',
												props[
													'motion-active-time-line-time'
												] === Number(key) &&
													props[
														'motion-active-time-line-index'
													] === i &&
													'maxi-motion-control__timeline__group__item--active-item'
											)}
											onClick={() =>
												onChange({
													'motion-active-time-line-time': +key,
													'motion-active-time-line-index': 0,
												})
											}
										>
											<span>
												{item.type}
												{typeCount[item.type] % 2 !==
													0 && (
													<Tooltip
														text={sprintf(
															__(
																'You need two "%s" effects to animate it.',
																'maxi-blocks'
															),
															item.type
																.charAt(0)
																.toUpperCase() +
																item.type.slice(
																	1
																)
														)}
														position='top right'
													>
														<span className='maxi-motion-control__timeline__group__item--alert' />
													</Tooltip>
												)}
											</span>
											<div className='maxi-motion-control__timeline__group__item__actions'>
												<i
													onClick={e => {
														e.stopPropagation();
														removeTimeline(
															item.type,
															key
														);
													}}
												>
													{toolbarDelete}
												</i>
											</div>
										</div>
									))}
									<div className='maxi-motion-control__timeline__group__position'>
										{key}%
									</div>
								</div>
							</Fragment>
						);
					}
				)}
		</div>
	);
};
export default ShowTimeline;
