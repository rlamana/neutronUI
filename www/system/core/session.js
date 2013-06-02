define([], function () {
	var Session = function (sessionData, context) {
		this._data = {
			username: sessionData.name,
			firstName: sessionData.metadata['eyeos.user.firstname'],
			lastName: sessionData.metadata['eyeos.user.lastname'],
			language: sessionData.metadata['eyeos.user.language'],
			context: context
		};
	};

	Session.prototype.toJSON = function() {
		return Object.create(this._data);
	};

	var sessionRegistry = {};

	sessionRegistry.setCurrentUserData = function (sessionData, context) {
		this._session = new Session(sessionData, context);
	};

	sessionRegistry.getCurrentUserData = function () {
		return this._session;
	};

	return sessionRegistry;
});