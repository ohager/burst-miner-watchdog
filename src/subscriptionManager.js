class SubscriptionManager {
	
	constructor() {
		this.subscriptions = {};
	}
	
	add(name, subscription) {
		
		if (!subscription.unsubscribe) {
			throw new Error("Passed object does not support an 'unsubscribe' function");
		}
		
		this.subscriptions = {
			...this.subscriptions,
			[name]: subscription
		};
	}
	
	unsubscribe() {
		const nameList = arguments.length > 0 ? Array.from(arguments) : Object.keys(this.subscriptions);
		nameList.forEach(n => {
			if (!this.subscriptions[n]) return;
			this.subscriptions[n].unsubscribe();
			delete this.subscriptions[n];
		});
	}
	
	unsubscribeAll() {
		this.unsubscribe();
	}
}

module.exports = SubscriptionManager;
