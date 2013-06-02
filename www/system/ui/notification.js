define([
	'system/selector',
	'system/view',

	'system/ui/animation',
	'system/ui/notificationStack',

	'tpl!system/ui/tpl/notification',
	'css!system/ui/css/notification'
],
function($, View, Animation, notificationStack, notificationTemplate) {
	var Notification = function(message, options) {
		View.call(this);

		var defaults = {
			time: 2000
		};

		this.options = options ? $.extend(defaults, options) : defaults;

		// Create List dom element and listen to its events
		this.$el = notificationTemplate({
			message: message || 'Empty notification',
			info: options.additionalInfo || ''
		});
		this.$el.listen(this.events, this);

		// Cache inner elements
		this.$content = this.$el.find('.content');

		this.registerSignals([
			'open',
			'closed'
		]);

		View.queue(this.open, this);
	};

	Notification.prototype = Object.create(View.prototype);

	Notification.prototype.events = {
		'mouseup'/*touchend'*/: function(e) {
			this.close();
		}
	};

	/**
	 * Set notification message
	 * @param {String} message 
	 */
	Notification.prototype.setMessage = function(message) {
		this.$content.find('h1').html(message);
	};


	/**
	 * Set notification additional info
	 * @param {String} info Additional info text
	 */
	Notification.prototype.setAdditionalInfo = function(info) {
		this.$content.find('p').html(info);
	};


	Notification.prototype.open = function() {
		Animation.play('fadeInUp', this.$el, function() {
			this.emit('open');
			this.$el.addClass('open');

			if(this.options.time > 0) {
				View.queue(this.close, this, this.options.time);
			}
		}, this);
	};

	Notification.prototype.close = function() {
		Animation.play('fadeOutUp', this.$el, function() {
			this.emit('closed');
			this.$el.hide();
			this.destroy();
		}, this);
	};

	Notification.prototype.destroy = function() {
		this.$el.remove();
		notificationStack.remove(this);
	};

	/**
	 * Shows a notification for a few seconds
	 * @static
	 */
	Notification.show = function(text, options) {
		var notification = new Notification(text, options);
		notificationStack.add(notification);
		return notification;
	};

	/**
	 * Shows a notification for a few seconds
	 * @static
	 */
	Notification.warning = function(text, options) {
		var notification = Notification.show(text, options);
		notification.$el.addClass('warning');
		return notification;
	};

	return Notification;
});