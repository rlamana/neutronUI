define([
	'system/selector',
	'system/view',
	'system/ui/animation',

	'app/chartView',
	'app/doseView',

	'css!app/css/display'
],
function($, View, Animation, ChartView, DoseView){
	var fixture2012 = [
		{label: 'jan', value: 0.3},
		{label: 'feb', value: 0.5},
		{label: 'mar', value: 0.6},
		{label: 'apr', value: 0.3},
		{label: 'may', value: 0.5},
		{label: 'jun', value: 0.7},
		{label: 'jul', value: 0.5},
		{label: 'aug', value: 0.25},
		{label: 'sep', value: 0.7},
		{label: 'oct', value: 0.2},
		{label: 'nov', value: 0.55},
		{label: 'dec', value: 0.1}
	];

	var fixture2013 = [
		{label: 'jan', value: 0.3},
		{label: 'feb', value: 0.5},
		{label: 'mar', value: 0.8},
		{label: 'apr', value: 0.3},
		{label: 'may', value: 0.50},
		{label: 'jun', value: 0.65},
		{label: 'jul', value: 0.5},
		{label: 'aug', value: 0.25},
		{label: 'sep', value: 0.7},
		{label: 'oct', value: 0.2},
		{label: 'nov', value: 0.55},
		{label: 'dec', value: 0.1}
	];

	var DisplayView = function() {
		View.call(this);

		this.$el = $('<div class="display-content"/>');
		this.$el.listen(this.events, this);

		// Chart view
		this.chartView = new ChartView();
		this.chartView.appendTo(this.$el);

		// Dose view
		this.doseView = new DoseView();
		this.doseView.appendTo(this.$el);

		this.render();
	};

	DisplayView.prototype = Object.create(View.prototype);
	DisplayView.prototype.events = {};

	DisplayView.prototype.render = function() {
		this.chartView.addYear('2012');
		this.chartView.addMonths(fixture2012);
		this.chartView.addYear('2013');
		this.chartView.addMonths(fixture2013);
	};

	return DisplayView;
});