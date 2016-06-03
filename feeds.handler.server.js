import { Meteor } from 'meteor/meteor';
import _ from 'lodash';
import Feeds from './feeds.collections';
import FeedsHandler from './feeds.handler';

if(Meteor.isServer) {
  FeedsHandler.add = function(namespace, key, actions) {
    FeedsHandler.stack[getEventName(namespace, key)] = actions;
  };

  FeedsHandler.bulkAdd = function (dict) {
    _.each(dict, (options, event) => FeedsHandler.add(...event.split('.'), options));
  }

  FeedsHandler.trigger = function(namespace, key, userId, customParams) {
    if(!userId) return console.warn(`[FEEDS] You must provide a userId to save a feed. The feed ${namespace}/${key} was not saved!`);
    const createdAt = new Date();
    Meteor.setTimeout(() => handleEventAndInsertFeed(namespace, key, userId, createdAt, customParams), 1000);
  };

  const defaultFeedsEvents = {
    data() { return {} },
    involvedUsersIds() { return [] },
    mail() {},
    before() {},
    after() {}
  }

  function handleEventAndInsertFeed(namespace, key, userId, createdAt, customParams) {
    const { docId } = customParams;
    const event = getEventName(namespace, key);
    let eventsParams = _.merge(customParams, { userId, createdAt });
    const notificationEventsController = _.defaults(FeedsHandler.stack[event] || {}, defaultFeedsEvents);
    // Data
    const data = eventsParams.data = notificationEventsController.data(eventsParams);
    // Involved users
    const involvedUsersIds = eventsParams.involvedUsersIds = _.concat(notificationEventsController.involvedUsersIds(eventsParams), userId);
    // Before
    notificationEventsController.before(eventsParams);
    // Mail
    Meteor.defer(() => notificationEventsController.mail(eventsParams));
    // Insert notification
    const doc = { namespace, key, userId, docId, createdAt, data, involvedUsersIds };
    FeedsHandler.beforeInsert(doc);
    Feeds.insert(doc);
    // After
    notificationEventsController.after(eventsParams);
  }

  function getEventName(namespace, key) {
    return `${namespace}.${key}`;
  }
}
