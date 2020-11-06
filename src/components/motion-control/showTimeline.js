/**
 * WordPress dependencies
 */
const { __, sprintf } = wp.i18n;
const { Fragment } = wp.element;
const { Tooltip } = wp.components;

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
	const { interaction, onChange } = props;

	const removeTimeline = (type, time) => {
		if (has(interaction.timeline, time)) {
			const result = filter(interaction.timeline[time], o => {
				return o.type !== type;
			});

			interaction.timeline = {
				...interaction.timeline,
				[time]: [...result],
			};

			if (isEmpty(result)) {
				const newTimeline = { ...interaction.timeline };
				delete newTimeline[time];

				interaction.timeline = {
					...newTimeline,
				};
			}
		}

		const res = flattenDeep(Object.entries(interaction.timeline));

		interaction.activeTimeline = {
			time: Number(res[0]),
			index: 0,
		};

		onChange(interaction);
	};

	const typeCount = {
		move: 0,
		scale: 0,
		skew: 0,
		rotate: 0,
		opacity: 0,
		blur: 0,
	};
	forIn(flattenDeep(Object.values(interaction.timeline)), value => {
		if (value.type === 'move') typeCount.move++;
		if (value.type === 'scale') typeCount.scale++;
		if (value.type === 'skew') typeCount.skew++;
		if (value.type === 'rotate') typeCount.rotate++;
		if (value.type === 'opacity') typeCount.opacity++;
		if (value.type === 'blur') typeCount.blur++;
	});

	return (
		<div className='maxi-motion-control__timeline'>
			{isEmpty(interaction.timeline) && (
				<div className='maxi-motion-control__timeline__no-effects'>
					<p>
						{__(
							'Please enter your first interaction effect',
							'maxi-blocks'
						)}
					</p>
				</div>
			)}
			{Object.entries(interaction.timeline).map(
				([key, value], i, arr) => {
					const prevValue = !isNil(arr[i - 1]) ? arr[i - 1][0] : 0;
					return (
						<Fragment>
							<div
								className='maxi-motion-control__timeline__space'
								style={{
									flexGrow: `${parseFloat(
										(Number(key) - Number(prevValue)) / 100
									)}`,
								}}
							/>
							<div className='maxi-motion-control__timeline__group'>
								{value.map((item, i) => (
									<div
										className={classnames(
											'maxi-motion-control__timeline__group__item',
											interaction.activeTimeline.time ===
												Number(key) &&
												interaction.activeTimeline
													.index === i &&
												'maxi-motion-control__timeline__group__item--active-item'
										)}
										onClick={() => {
											interaction.activeTimeline = {
												time: Number(key),
												index: i,
											};
											onChange(interaction);
										}}
									>
										<span>
											{item.type}
											{typeCount[item.type] % 2 !== 0 && (
												<Tooltip
													text={sprintf(
														__(
															'You need two "%s" effects to animate it.',
															'maxi-blocks'
														),
														item.type
															.charAt(0)
															.toUpperCase() +
															item.type.slice(1)
													)}
													position='top right'
												>
													<span className='maxi-motion-control__timeline__group__item--alert'></span>
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
