/* eslint-disable import/no-unresolved */
/* eslint-disable prefer-rest-params */
/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
/* eslint-disable no-plusplus */
/* eslint-disable react/sort-comp */
/* eslint-disable class-methods-use-this */
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Component } from '@wordpress/element';
import { withSpokenMessages, withFilters, Button } from '@wordpress/components';
import { withInstanceId, compose } from '@wordpress/compose';

/**
 * External dependencies
 */
import { get, unescape as unescapeString, filter, isEmpty } from 'lodash';

/**
 * Internal dependencies
 */
import buildTermsTree from './terms';

class HierarchicalTermSelector extends Component {
	constructor() {
		super(...arguments);
		this.onChange = this.onChange.bind(this);
		this.sortBySelected = this.sortBySelected.bind(this);

		this.categories = this.props.terms;
		const availableTermsTree = this.sortBySelected(
			buildTermsTree(this.categories)
		);

		this.state = {
			availableTermsTree,
			filterValue: '',
			filteredTermsTree: [],
		};
	}

	onChange(termId) {
		const { onUpdateTerms, selectedTerms = [] } = this.props;
		const hasTerm = selectedTerms.indexOf(termId) !== -1;
		const newTerms = hasTerm
			? filter(selectedTerms, id => {
					return id !== termId;
			  })
			: [...selectedTerms, termId];

		onUpdateTerms(newTerms);
	}

	sortBySelected(termsTree) {
		const { terms } = this.props;
		const treeHasSelection = termTree => {
			if (terms.indexOf(termTree.id) !== -1) {
				return true;
			}
			if (undefined === termTree.children) {
				return false;
			}
			const anyChildIsSelected =
				termTree.children.map(treeHasSelection).filter(child => child)
					.length > 0;
			if (anyChildIsSelected) {
				return true;
			}
			return false;
		};
		const termOrChildIsSelected = (termA, termB) => {
			const termASelected = treeHasSelection(termA);
			const termBSelected = treeHasSelection(termB);

			if (termASelected === termBSelected) {
				return 0;
			}

			if (termASelected && !termBSelected) {
				return -1;
			}

			if (!termASelected && termBSelected) {
				return 1;
			}

			return 0;
		};
		termsTree.sort(termOrChildIsSelected);
		return termsTree;
	}

	renderTerms(renderedTerms) {
		const { selectedTerms = [] } = this.props;
		return renderedTerms.map(term => {
			const isSelected = !isEmpty(selectedTerms)
				? selectedTerms.some(id => {
						return id === term.id;
				  })
				: false;

			return (
				<div
					key={term.id}
					className='editor-post-taxonomies__hierarchical-terms-choice'
				>
					<Button
						className='maxi-cloud-sidebar__button'
						onClick={() => {
							const termId = parseInt(term.id, 10);
							this.onChange(termId);
						}}
						label={unescapeString(term.name)}
						aria-pressed={isSelected}
					>
						{unescapeString(term.name)}
					</Button>
					{!!term.children.length && (
						<div className='editor-post-taxonomies__hierarchical-terms-subchoices'>
							{this.renderTerms(term.children)}
						</div>
					)}
				</div>
			);
		});
	}

	render() {
		const {
			availableTermsTree,
			filteredTermsTree,
			filterValue,
		} = this.state;
		const groupLabel = get(this.props.taxonomy, ['name'], __('Terms'));

		return (
			<div
				className='editor-post-taxonomies__hierarchical-terms-list'
				key='term-list'
				tabIndex='0'
				role='group'
				aria-label={groupLabel}
			>
				{this.renderTerms(
					filterValue !== '' ? filteredTermsTree : availableTermsTree
				)}
			</div>
		);
	}
}

export default compose([
	withSpokenMessages,
	withInstanceId,
	withFilters('editor.PostTaxonomyType'),
])(HierarchicalTermSelector);
