define([
	'system/selector',
	'system/view',

	'system/ui/page',
	'system/ui/animation',

	'css!system/ui/css/book'
],
function($, View, Page, Animation) {
	var Book = function() {
		View.call(this);

		// Create List dom element and listen to its events
		this.$el = $('<div class="book" />');

		this.registerSignals([
			'browse',
			'rightButtonPressed',
			'leftButtonPressed'
		]);
	};

	Book.prototype = Object.create(View.prototype, {
		currentPage: {
			set: function(page) {
				var newIndex = this._pages.indexOf(page);
				var oldIndex = this._currentPage ? this._pages.indexOf(this._currentPage) : null;

				var direction = (newIndex < oldIndex) ? 'left' : 'right';

				if(newIndex >= 0) {
					this._transition(direction, this._currentPage ? this._currentPage.$el : null, page.$el, function() {
						if(this._currentPage)
							this._currentPage.$el.detach();

						this._currentPage = page;
					}, this);
				} else {
					console.warn('The page is not in the book');
				}
			},

			get: function() {
				return this._currentPage;
			}
		}
	});

	Book.prototype._pages = [];

	Book.prototype.addPage = function(page) {
		if((page instanceof Page) && (this._pages.indexOf(page) < 0)) {
			this._pages.push(page);
		} else {
			console.warn('Trying to add a non-Page object to a book');
		}
	};

	Book.prototype.removePage = function(page) {
		var i = this._pages.indexOf(page);
		if(i < 0) {
			this._pages.splice(i, 1);
			page.$el.detach();
		}
	};

	Book.prototype.goToPage = function(page) {
		this.currentPage = page;
	};

	Book.prototype._transition = function(direction, $from, $to, callback, scope) {
		var space, transitionTime = 0.4;
		var $container = this.$el;

		direction = direction || 'left';

		// Place new view to be shown	
		$container.append($to);
		$to.css('opacity', 0);

		setTimeout((function() {
			space = $container.width();
			space = (direction === 'left') ? -space : space;
			space = (direction !== null) ? space : 0;
			$to.css({
				'-webkit-transform': 'translateX('+space+'px)',
				'opacity': 1
			});

			// Activate fade animation
			//$to.css('-webkit-transition', 'opacity '+transitionTime+'s');

			// Activate animation
			$container.css({
				'-webkit-transition': '-webkit-transform '+transitionTime+'s',
				'-webkit-transform': 'translate3d('+(-space)+'px,0,0)'
			});

			$container.onTransitionEnd(function(){
				// Restore content position
				$to.css('-webkit-transform', 'translateX(0)');
				$container.css({
					'-webkit-transition': 'none',
					'-webkit-transform': 'translate3d(0,0,0)'
				});

				// Call user callback passing old-view and the new one
				if(typeof callback === 'function')
					callback.call(scope||this, $from, $to);
			}, this);

		}).bind(this), 0);
	};

	return Book;
});