import _ from 'lodash';

FeedsComponents = {
  stack: {},

  register(eventName, Component) {
    if(!!this.stack[eventName]) console.warn(`[FEEDS] ${eventName} already has a component registered.`);
    this.stack[eventName] = Component;
  },

  get(feedOreventName) {
    const eventName = _.isString(feedOreventName) ? feedOreventName : feedOreventName.event;
    return this.stack[eventName];
  }
};

export default FeedsComponents;
