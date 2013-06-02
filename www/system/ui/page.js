define([
	'Underscore',

	'system/selector',
	'system/view',

	'system/ui/button',
	'system/ui/animation',

	'tpl!system/ui/tpl/page',
	'css!system/ui/css/page'
],
function(_, $, View, Button, Animation, pageTemplate) {
	/**
	 * Page Class
	 *
	 * @extends View
	 * @param {String} options 
	 */
	var Page = function(options) {
		View.call(this);

		var options = _.extend({
			name: '',
			title: 'Untitled',
			showHeader: true,
			showFooter: false
		}, options);

		// Create List dom element and listen to its events
		this.$el = pageTemplate({
			title: options.title
		});
		this.$el.listen(this.events, this);

		if((typeof options.name === 'string') && (options.name !== ''))
			this.$el.attr('id', options.name);

		// Cache inside elements
		this.$content = this.$el.find('.page-content');
		this.$title = this.$el.find('.page-title');
		this.$footer = this.$el.find('.page-footer');
		this.$header = this.$el.find('.page-header');

		if(!options.showFooter)
			this.hideFooter();

		if(!options.showHeader)
			this.hideHeader();

		this.rightButton = new Button();
		this.rightButton.enabled = false;
		this.rightButton
			.appendTo(this.$el.find('.page-right-button'))
			.connect(this.slots.button, this);

		this.leftButton = new Button();
		this.leftButton.enabled = false;
		this.leftButton
			.appendTo(this.$el.find('.page-left-button'))
			.connect(this.slots.button, this);

		this.registerSignals([
			'browse',
			'rightButtonPressed',
			'leftButtonPressed'
		]);

		this.mainView = null;
	};

	Page.prototype = Object.create(View.prototype);

	Page.prototype.mainView = null;

	Page.prototype.events = {
		'mousemove':/*touchmove*/ function(e) {
			// Avoid useless scroll in browser, this page content
			// should be the scrollable element
			return e.preventDefault();
		},

		'.page-header mousemove':/*touchmove*/ function(e) {
			// Avoid useless scroll in browser, this page content
			// should be the scrollable element
			return e.preventDefault();
		},

		'.page-title mouseup':/*touchend'*/ function(e) {
			this.emit('titlePressed');
		}
	};

	Page.prototype.slots = {
		button: {
			pressed: function(button, e) {
				if(button === this.rightButton) {
					this.emit('rightButtonPressed', button, e);
					this.$el.find('.page-right-button').removeClass('touched');
				}
				else if(button === this.leftButton) {
					this.emit('leftButtonPressed', button, e);
					this.$el.find('.page-left-button').removeClass('touched');
				}
			},

			touched: function(button, e) {
				if(button === this.rightButton)
					this.$el.find('.page-right-button').addClass('touched');
				else if(button === this.leftButton)
					this.$el.find('.page-left-button').addClass('touched');
			}
		}
	};

	/**
	 * Set page main content view.
	 *
	 * @param view {View} View to append and render in the Page content area
	 * @param transition {string|null} Animation transition to use while switching to the new content view
	 * @param callback {Funcion} Callback function executed when the transition has finished f(oldView, newView)
	 * @param scope {Object} Scope of the callback function
	 */
	Page.prototype.setContentView = function(view, transition, callback, scope){
		var transitionMethod;
		if (transition === 'right')
			transitionMethod = this.swipeToRight;
		else if(transition === 'left')
			transitionMethod = this.swipeToLeft;
		else if(transition === 'pulse')
			transitionMethod = this.pulse;
		else
			transitionMethod = this.fadeIn;

		return transitionMethod.call(this, view, callback, scope);
	};

	/**
	 * Animated content swipe to right to a new view.
	 *
	 * @param view {View} View to append and render in the Page content area
	 * @param callback {Funcion} Callback function executed when the transition has finished f(oldView, newView)
	 * @param scope {Object} Scope of the callback function
	 */
	Page.prototype.swipeToRight = function(view, callback, scope) {
		this._transitionToView('right', view, callback, scope);
	};

	/**
	 * Animated swipe content to the left to a new view.
	 *
	 * @param view {View} View to append and render in the Page content area
	 * @param callback {Funcion} Callback function executed when the transition has finished f(oldView, newView)
	 * @param scope {Object} Scope of the callback function
	 */
	Page.prototype.swipeToLeft = function(view, callback, scope) {
		this._transitionToView('left', view, callback, scope);
	};

	/**
	 * Fade-in content to show a new view.
	 *
	 * @param view {View} View to append and render in the Page content area
	 * @param callback {Funcion} Callback function executed when the transition has finished f(oldView, newView)
	 * @param scope {Object} Scope of the callback function
	 */
	Page.prototype.fadeIn = function(view, callback, scope) {
		this._transitionToView(null, view, callback, scope);
	};

	/**
	 * Flip content from current view to the new given view.
	 *
	 * @param view {View} View to append and render in the Page content area
	 * @param callback {Funcion} Callback function executed when the transition has finished f(oldView, newView)
	 * @param scope {Object} Scope of the callback function
	 */
	Page.prototype.pulse = function(view, callback, scope) {
		Animation.play('pulse', this.$content, function(){
			this.$content.append(view.$el);

			// Set new view as mainView
			this._setContentView(view, callback, scope);
		}, this);
	};

	/**
	 * Fade out current content view
	 *
	 * @param callback {Funcion} Callback function executed when the transition has finished
	 * @param scope {Object} Scope of the callback function
	 */
	Page.prototype.fadeOut = function(callback, scope) {
		Animation.play('fadeOut', this.$content, function(){
			if(callback && typeof callback === 'function')
				callback.call(scope);
		});
	};

	/**
	 * Animated switch to a to a new content view.
	 *
	 * @param animation {string} Animation switching to the new content view
	 * @param view {View} View to append and render in the Page content area
	 * @param callback {Funcion} Callback function executed when the transition has finished f(oldView, newView)
	 * @param scope {Object} Scope of the callback function
	 */
	Page.prototype._transitionToView = function(animation, view, callback, scope) {
		var space, transitionTime = 0.4;

		if(!(view instanceof View)) {
			console.warn("The object to add in the page content is not a View.");
			return;
		}

		// Place new view to be shown	
		this.$content.append(view.$el);
		view.$el.css('opacity', 0);

		setTimeout((function() {
			space = this.$content.width();
			space = (animation === 'left') ? -space : space;
			space = (animation !== null) ? space : 0;
			view.$el.css({
				'-webkit-transform': 'translateX('+space+'px)',
				'opacity': 1
			});

			// Activate fade animation
			if(!animation) {
				view.$el.css('-webkit-transition', 'opacity '+transitionTime+'s');
			}

			// Activate animation
			this.$content.css({
				'-webkit-transition': '-webkit-transform '+transitionTime+'s',
				'-webkit-transform': 'translate3d('+(-space)+'px,0,0)'
			});

			this.$content.onTransitionEnd(function(){
				// Restore content position
				view.$el.css('-webkit-transform', 'translateX(0)');
				this.$content.css({
					'-webkit-transition': 'none',
					'-webkit-transform': 'translate3d(0,0,0)'
				});

				// Set new view as mainView
				this._setContentView(view, callback, scope);
			}, this);

		}).bind(this), 0);
	};

	Page.prototype._setContentView = function(view, callback, scope) {
		// Call user callback passing old-view and the new one
		if(typeof callback === 'function')
			callback.call(scope||this, this.mainView, view);

		// Set new view as mainView
		this.mainView = view;
	};

	/**
	 * Set header title in this page
	 * @param {String} title Page title text
	 */
	Page.prototype.setTitle = function(title) {
		this.$title.html(title);
	};

	/**
	 * Shows page header
	 */
	Page.prototype.showHeader = function() {
		this.$header.removeProp('hidden');
	};

	/**
	 * Hides page header
	 */
	Page.prototype.hideHeader = function() {
		this.$header.prop('hidden','hidden');
	};

	/**
	 * Shows page footer
	 */
	Page.prototype.showFooter = function() {
		this.$footer.removeProp('hidden');
	};

	/**
	 * Hides page footer
	 */
	Page.prototype.hideFooter = function() {
		this.$footer.prop('hidden','hidden');
	};

	/**
	 * Set footer content
	 * @protected
	 */
	Page.prototype._setFooterContent = function(element) {
		this.$footer.html(element);
	};

	return Page;
});