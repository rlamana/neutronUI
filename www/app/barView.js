define([
	'system/selector',
	'system/view',
	'system/ui/animation',

	'app/dosePresenter',

	'tpl!app/tpl/bar',
	'css!app/css/bar'
],
function($, View, Animation, DosePresenter, barTemplate){

	var BarView = function(label, value) {
		View.call(this);

		this.$el = new barTemplate({
			label: label || ''
		});
		this.$el.listen(this.events, this);

		this.$bar = this.$el.find('.bar');
		this.$value = this.$bar.find('.value');
		this.$bubble = this.$bar.find('.bubble');

		this.registerSignals(['selected', 'unselected']);

		this.value = value || 0.0;
		this.label = label;
	};

	BarView.prototype = Object.create(View.prototype, {
		label: {
			set: function (label) {
				this._label = label;
				this.$el.find('.label').html(label);
			},

			get: function () {
				return this._label;
			}
		},

		value: {
			set: function (value) {
				var level = DosePresenter.checkLevel(value);
				var percentage = Math.floor(value*100/0.8);

				this._value = value;
				this.$value.css('height', percentage + '%');

				this.$bar.data({
					percentage: percentage,
					value: value
				});

				this.$bubble.html(value);

				// Set danger level
				this.$bar.removeClass('warning danger');
				switch(level) {
					case 'warning':
						this.$bar.addClass('warning');
					break;

					case 'danger':
						this.$bar.addClass('danger');
					break;

					case 'good':
						this.$bar.addClass('good');
					break;
				}
			},

			get: function () {
				return this._value;
			}
		}
	});

	BarView.prototype.events = {
		'click': function(e) {
			this.select();
		}
	};

	BarView.prototype.select = function() {
		if(this.$bar.hasClass('selected'))
			return false;

		this.$bar.addClass('selected');
		this.$bubble.removeAttr('hidden');

		Animation.play('pulse', this.$bar);
		Animation.play('fadeInUpSmall', this.$bubble);

		this.emit('selected', this);
	};

	BarView.prototype.unselect = function() {
		if(!this.$bar.hasClass('selected'))
			return false;

		this.$bar.removeClass('selected');

		Animation.play('fadeOutDownSmall', this.$bubble, function() {
			this.$bubble.attr('hidden', true);
		}, this);

		this.emit('unselected', this);
	};

	return BarView;
});