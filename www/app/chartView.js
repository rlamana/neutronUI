define([
	'system/selector',
	'system/view',
	'system/ui/animation',

	'app/barView',

	'tpl!app/tpl/chart',
	'css!app/css/chart',

	'vendor/iscroll'
],
function($, View, Animation, BarView, chartTemplate){

	var ChartView = function() {
		View.call(this);

		this.$el = new chartTemplate();
		this.$el.listen(this.events, this);

		this.$bars = this.$el.find('.bars');

		this.scroller = new iScroll(this.$el[0], {
            vScroll: false,
            zoom: false,
            hScrollbar: false,
			vScrollbar: false
        });

        this.refresh();
	};

	ChartView.prototype = Object.create(View.prototype);

	ChartView.prototype.events = {};

	ChartView.prototype.slots = {
		bars: {
			'selected': function (bar) {
				if(this._selected)
					this._selected.unselect();

				this._selected = bar;
			}
		}
	};

	ChartView.prototype.refresh = function () {
		View.queue(function () {
			this.scroller.refresh();
		}, this);
	};

	ChartView.prototype.addMonth = function (label, value, delay) {
		var month = new BarView(label);

		// Connect bar signals
		month.connect(this.slots.bars, this);

		this.$bars.append(month.$el);

		View.queue(function () {
			month.value = value;
		}, this, delay);

		this.refresh();

		return this;
	};

	ChartView.prototype.addMonths = function (data) {
		for(var i=0,len=data.length;i<len;i++) {
			this.addMonth(data[i].label, data[i].value, i*100);
		}
	};

	ChartView.prototype.addYear = function(label) {
		$year = $('<li class="year" />')
			.html(label)
			.appendTo(this.$bars);
	};

	return ChartView;
});