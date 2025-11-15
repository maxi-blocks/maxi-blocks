(function ($) {
    const settings = window.MaxiUnsplash || {};
    const perPage = parseInt(settings.perPage, 10) || 18;
    const strings = $.extend(
        {
            tabTitle: 'Unsplash',
            searchLabel: 'Search Unsplash',
            searchPlaceholder: 'Search Unsplash…',
            searchButton: 'Search',
            emptyQuery: 'Enter a search term to find Unsplash images.',
            importing: 'Importing image…',
            importSuccess: 'Image imported to the Media Library.',
            importError: 'Unable to import the selected image.',
            importLabel: 'Import',
            loadMore: 'Load more',
            noResults: 'No images found. Try a different search term.',
            errorGeneral: 'Unexpected error. Please try again.',
            viewOnUnsplash: 'View on Unsplash',
        },
        settings.strings || {},
    );

    if (!window.wp || !wp.media || !wp.Backbone) {
        return;
    }

    const media = wp.media;
    const Frame = media.view.MediaFrame.Select;
    const browserTemplate = wp.template('maxi-unsplash-browser');
    const cardTemplate = wp.template('maxi-unsplash-card');

    const originalCreateStates = Frame.prototype.createStates;
    Frame.prototype.createStates = function () {
        originalCreateStates.apply(this, arguments);

        if (!this.states.get('maxi-unsplash')) {
            this.states.add(
                new media.controller.State({
                    id: 'maxi-unsplash',
                    menu: 'default',
                    title: strings.tabTitle,
                    content: 'maxi-unsplash',
                    toolbar: 'maxi-unsplash',
                    router: 'browse',
                    priority: 120,
                }),
            );
        }
    };

    const originalBrowseRouter = Frame.prototype.browseRouter;
    Frame.prototype.browseRouter = function (routerView) {
        originalBrowseRouter.apply(this, arguments);

        if (!routerView.get('maxi-unsplash')) {
            const frame = this;

            routerView.set({
                'maxi-unsplash': {
                    text: strings.tabTitle,
                    priority: 80,
                    click() {
                        frame.setState('maxi-unsplash');
                    },
                },
            });
        }
    };

    const PostFrame = media.view.MediaFrame.Post;

    if (PostFrame) {
        const originalPostBrowseRouter = PostFrame.prototype.browseRouter;
        PostFrame.prototype.browseRouter = function (routerView) {
            originalPostBrowseRouter.apply(this, arguments);

            if (!routerView.get('maxi-unsplash')) {
                const frame = this;

                routerView.set({
                    'maxi-unsplash': {
                        text: strings.tabTitle,
                        priority: 80,
                        click() {
                            frame.setState('maxi-unsplash');
                        },
                    },
                });
            }
        };
    }

    const originalBindHandlers = Frame.prototype.bindHandlers;
    Frame.prototype.bindHandlers = function () {
        originalBindHandlers.apply(this, arguments);

        this.on('content:render:maxi-unsplash', this.renderMaxiUnsplash, this);
        this.on('toolbar:create:maxi-unsplash', this.createMaxiUnsplashToolbar, this);
    };

    Frame.prototype.renderMaxiUnsplash = function (contentRegion) {
        if (!this.maxiUnsplashView) {
            this.maxiUnsplashView = new MaxiUnsplashBrowser({
                controller: this,
                strings,
                perPage,
                settings,
            });
        }

        contentRegion.view = this.maxiUnsplashView;
    };

    Frame.prototype.createMaxiUnsplashToolbar = function (toolbarRegion) {
        toolbarRegion.view = new media.view.Toolbar({
            controller: this,
        });
    };

    const MaxiUnsplashBrowser = wp.Backbone.View.extend({
        className: 'maxi-unsplash-browser-wrapper',

        template: browserTemplate,

        events: {
            'submit .maxi-unsplash-search-form': 'onSearchSubmit',
            'click .maxi-unsplash-load-more': 'onLoadMore',
            'click .maxi-unsplash-import': 'onImportClick',
        },

        initialize(options) {
            this.controller = options.controller;
            this.strings = options.strings;
            this.perPage = options.perPage;
            this.settings = options.settings;
            this.query = '';
            this.page = 1;
            this.totalPages = 0;
            this.isLoading = false;
            this.hasLoadedInitial = false;
        },

        render() {
            this.$el.html(this.template({ strings: this.strings }));
            this.$form = this.$('.maxi-unsplash-search-form');
            this.$input = this.$('#maxi-unsplash-query');
            this.$feedback = this.$('.maxi-unsplash-feedback');
            this.$results = this.$('.maxi-unsplash-results');
            this.$loadMore = this.$('.maxi-unsplash-load-more');

            if (!this.hasLoadedInitial) {
                this.hasLoadedInitial = true;
                this.fetchResults();
            }

            return this;
        },

        onSearchSubmit(event) {
            event.preventDefault();
            const value = this.$input.val() ? this.$input.val().trim() : '';

            this.query = value;
            this.page = 1;
            this.totalPages = 0;
            this.$results.empty();

            this.fetchResults();
        },

        onLoadMore(event) {
            event.preventDefault();

            if (this.isLoading) {
                return;
            }

            if (this.page >= this.totalPages && this.totalPages !== 0) {
                return;
            }

            this.page += 1;
            if (this.$loadMore && this.$loadMore.length) {
                this.$loadMore.prop('disabled', true);
            }
            this.fetchResults(true);
        },

        onImportClick(event) {
            event.preventDefault();

            const button = $(event.currentTarget);
            const photoId = button.data('photo-id');

            if (!photoId || button.hasClass('is-importing')) {
                return;
            }

            button.addClass('is-importing');
            button.prop('disabled', true);
            button.text(this.strings.importing);

            $.ajax({
                url: this.settings.ajaxUrl,
                method: 'POST',
                dataType: 'json',
                data: {
                    action: 'maxi_unsplash_import',
                    nonce: this.settings.nonce,
                    photoId,
                },
            })
                .done((response) => {
                    if (response && response.success && response.data) {
                        button.addClass('is-imported');
                        button.removeClass('button-secondary').addClass('button-primary');
                        button.text(this.strings.importSuccess);
                        this.setFeedback(this.strings.importSuccess);
                        this.focusAttachment(response.data.attachmentId);
                    } else {
                        this.handleImportError(button, response && response.data ? response.data.message : '');
                    }
                })
                .fail((jqXHR) => {
                    const message =
                        jqXHR && jqXHR.responseJSON && jqXHR.responseJSON.data
                            ? jqXHR.responseJSON.data.message
                            : '';
                    this.handleImportError(button, message);
                })
                .always(() => {
                    setTimeout(() => {
                        button.removeClass('is-importing');
                        if (!button.hasClass('is-imported')) {
                            button.prop('disabled', false);
                            button.text(this.strings.importLabel);
                        }
                    }, 2000);
                });
        },

        handleImportError(button, message) {
            button.prop('disabled', false);
            button.removeClass('is-importing');
            button.text(this.strings.importError);
            this.setFeedback(message || this.strings.importError);
        },

        fetchResults(append) {
            if (this.isLoading) {
                return;
            }

            this.isLoading = true;

            if (!append) {
                this.toggleSpinner(true);
                this.setFeedback('');
            }

            $.ajax({
                url: this.settings.ajaxUrl,
                method: 'POST',
                dataType: 'json',
                data: {
                    action: 'maxi_unsplash_search',
                    nonce: this.settings.nonce,
                    query: this.query,
                    page: this.page,
                    per_page: this.perPage,
                },
            })
                .done((response) => {
                    if (!response || !response.success || !response.data) {
                        this.handleSearchError(response && response.data ? response.data.message : '');
                        return;
                    }

                    const items = response.data.results || [];
                    this.totalPages = response.data.totalPages || 0;

                    this.renderResults(items, append);

                    if (items.length === 0 && !append) {
                        this.setFeedback(this.strings.noResults);
                    }

                    if (this.$loadMore.length) {
                        if (this.totalPages && this.page < this.totalPages) {
                            this.$loadMore.prop('hidden', false);
                        } else if (!this.totalPages && items.length >= this.perPage) {
                            this.$loadMore.prop('hidden', false);
                        } else {
                            this.$loadMore.prop('hidden', true);
                        }
                    }
                })
                .fail((jqXHR) => {
                    const message =
                        jqXHR && jqXHR.responseJSON && jqXHR.responseJSON.data
                            ? jqXHR.responseJSON.data.message
                            : '';
                    this.handleSearchError(message);
                })
                .always(() => {
                    this.isLoading = false;
                    this.toggleSpinner(false);
                    if (this.$loadMore && this.$loadMore.length) {
                        this.$loadMore.prop('disabled', false);
                    }
                });
        },

        renderResults(items, append) {
            if (!this.$results || !this.$results.length) {
                return;
            }

            if (!items.length) {
                if (!append) {
                    this.$results.empty();
                }
                return;
            }

            const fragments = document.createDocumentFragment();

            items.forEach((item) => {
                const data = {
                    id: item.id,
                    title: item.title || '',
                    alt: item.alt || '',
                    thumb: item.thumb || item.regular || item.full || '',
                    credit: item.credit || '',
                    link: item.link || '',
                    strings: this.strings,
                };

                const html = cardTemplate(data);
                const wrapper = document.createElement('div');
                wrapper.innerHTML = html;
                const card = wrapper.firstElementChild;
                if (card) {
                    fragments.appendChild(card);
                }
            });

            const container = this.$results[0];

            if (!container) {
                return;
            }

            if (append) {
                container.appendChild(fragments);
            } else {
                this.$results.empty();
                container.appendChild(fragments);
            }
        },

        handleSearchError(message) {
            this.setFeedback(message || this.strings.errorGeneral);
            if (this.$loadMore.length) {
                this.$loadMore.prop('hidden', true);
            }
        },

        setFeedback(message) {
            if (!this.$feedback) {
                return;
            }

            this.$feedback.text(message || '');
        },

        toggleSpinner(isLoading) {
            if (!this.$feedback) {
                return;
            }

            if (isLoading) {
                const spinner = $('<span />', {
                    class: 'spinner is-active',
                    'aria-hidden': 'true',
                });
                this.$feedback.empty().append(spinner);
            } else if (this.$feedback.find('.spinner').length) {
                this.$feedback.empty();
            }
        },

        focusAttachment(attachmentId) {
            if (!attachmentId || !wp.media || !wp.media.attachment) {
                return;
            }

            const attachment = wp.media.attachment(attachmentId);
            const frame = this.controller;
            const libraryState = frame.states.get('library');

            if (libraryState && libraryState.get('selection')) {
                libraryState.get('selection').reset([attachment]);
            }

            frame.setState('library');
            attachment.fetch();
        },
    });
})(jQuery);
