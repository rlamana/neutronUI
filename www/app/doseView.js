define([
	'system/selector',
	'system/view',
	'system/ui/animation',

	'app/dosePresenter',

	'tpl!app/tpl/dose',
	'css!app/css/dose'
],
function($, View, Animation, DosePresenter, doseTemplate){

	var DoseView = function() {
		View.call(this);

		this.$el = new doseTemplate();
		this.$el.listen(this.events, this);

		this.$value = this.$el.find('.value');
		this.$bubble = this.$el.find('.bubble');

		Animation.play('fadeInUp', this.$el, this.init.bind(this));
	};

	DoseView.prototype = Object.create(View.prototype, {
		value: {
			set: function (value) {
				var level = DosePresenter.checkLevel(value);

				this._value = value;
				this.$value.html(value);

				this.$el.removeClass('warning danger good');

				switch(level) {
					case 'warning':
						this.$el.addClass('warning');
					break;

					case 'danger':
						this.$el.addClass('danger');
						Animation.repeat('breath', this.$el);
					break;

					case 'good':
						this.$el.addClass('good');
					break;
				}

				if (level !== 'danger')
					Animation.stop('breath', this.$el);
			},

			get: function () {
				return this._value;
			}
		}
	});

	DoseView.prototype.events = {
		'.bubble touchstart': function (e) {
			$bubble = $(e.currentTarget);
			this.$el.css('-webkit-transform', 'scale(1.1)');
		},

		'.bubble touchend': function (e) {
			$bubble = $(e.currentTarget);
			this.$el.css('-webkit-transform', 'scale(1)');
		}
	};

	DoseView.prototype.init = function() {
		this.capture();
	};

	DoseView.prototype.capture = function () {
		View.queue(function () {
			var randomValue = Math.floor(Math.random()* 100)/100;
			this.value = randomValue;
			this.capture();
		}, this, 2000);
	};

	return DoseView;
});