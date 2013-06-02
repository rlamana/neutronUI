define(function () {
	var DosePresenter = function () {
	};

	DosePresenter.checkLevel = function(value) {
		if ((value > 0.0) && (value < 0.2)) 
			return 'good';
		else if ((value > 0.5) && (value < 0.8))
			return 'warning';
		else if(value >= 0.8)
			return 'danger';

		return 'normal';
	};

	return DosePresenter;
});