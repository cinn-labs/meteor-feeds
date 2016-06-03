import _ from 'lodash';

FeedsComponents = {
  stack: {},

  register(eventName, Component) {
    if(!!this.stack[eventName]) console.warn(`[FEEDS] ${eventName} already has a component registered.`);
    this.stack[eventName] = Component;
  },

  get(feedOrEventName) {
    const eventName = _.isString(feedOrEventName) ? feedOrEventName : getEventName(feedOrNamespace.namespace, feedOrNamespace.key);
    if(!this.stack[eventName]) console.warn(`[FEEDS] Feed component ${eventName} not found.`);
    return this.stack[eventName];
  }
};

function getEventName(namespace, key) {
  return `${namespace}.${key}`;
}

export default FeedsComponents;
