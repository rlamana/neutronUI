define([
	'system/selector',
	'system/ui/page',

	'app/displayView'
],
function($, Page, DisplayView){
	var DisplayPage = function() {
		Page.call(this, {
			name: 'display',
			showHeader: false
		});

		this.displayView = new DisplayView();
		this.fadeIn(this.displayView);
	};

	DisplayPage.prototype = Object.create(Page.prototype);

	return DisplayPage;

});