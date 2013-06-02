define([
	'Underscore',
	'system/selector',
	'system/view'
],
function(_, $, View) {
	var stack = [];

	/**
	 * Singleton.
	 * Keeps a stack of notifications
	 */
	var notificationStack = new View();
	notificationStack.$el = $('<div id="notification-stack" />').appendTo('body');

	/**
	 * Adds a new notification to the stack
	 */
	notificationStack.add = function(notification) {
		notificationStack.$el.append(notification.$el);
		stack.push(notification);
	};

	/**
	 * Remove a notification from stack
	 */
	notificationStack.remove = function(notification) {
		stack = _.without(stack, notification);
	};

	/**
	 * Closes all notifications
	 */
	notificationStack.clear = function() {
		if(stack.length === 0)
			return;

		_.map(stack, function(notification) {
			notification.close();
		});
		stack = [];
	};

	return notificationStack;
});