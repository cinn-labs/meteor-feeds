import { Meteor } from 'meteor/meteor';
import _ from 'lodash';
import Feeds from './feeds.collections';
import FeedsHandler from './feeds.handler';

if(Meteor.isServer) {
  FeedsHandler.add = function(event, actions) {
    FeedsHandler.stack[event] = actions;
  };

  FeedsHandler.bulkAdd = function (dict) {
    _.each(dict, (options, event) => FeedsHandler.add(event, options));
  }

  FeedsHandler.trigger = function(event, userId, customParams) {
    if(!userId) return console.warn(`[FEEDS] You must provide a userId to save a feed. The feed ${event} was not saved!`);
    const createdAt = new Date();
    Meteor.setTimeout(() => handleEventAndInsertFeed(event, userId, createdAt, customParams), 1000);
  };

  const defaultFeedsEvents = {
    data() { return {} },
    involvedUsersIds() { console.log(123); return [] },
    mail() {},
    before() {},
    after() {}
  }

  function handleEventAndInsertFeed(event, userId, createdAt, customParams) {
    const { docId } = customParams;
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
    const doc = { event, userId, docId, createdAt, data, involvedUsersIds };
    FeedsHandler.beforeInsertAll(doc);
    Feeds.insert(doc);
    // After
    notificationEventsController.after(eventsParams);
  }
}
