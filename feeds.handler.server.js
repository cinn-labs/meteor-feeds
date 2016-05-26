import { Meteor } from 'meteor/meteor';
import _ from 'lodash';
import Feeds from './feeds.collections';
import FeedsHandler from './feeds.handler';

if(Meteor.isServer) {
  FeedsHandler.add = function(event, { data, mail, before, after }) {
    FeedsHandler.stack[event] = { data, mail, before, after };
  };

  FeedsHandler.bulkAdd = function (dict) {
    _.each(dict, (options, event) => FeedsHandler.add(event, options));
  }

  FeedsHandler.trigger = function(event, userId, customParams) {
    if(!userId) return console.warn(`[FEEDS] You must provide a userId to save a feed. The feed ${event} was not saved!`);
    const createdAt = new Date();
    Meteor.defer(() => handleEventAndInsertFeed(event, userId, createdAt, customParams));
  };

  const defaultFeedsEvents = {
    data() { return {} },
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
    // Before
    notificationEventsController.before(eventsParams);
    // Mail
    Meteor.defer(() => notificationEventsController.mail(eventsParams));
    // Insert notification
    Feeds.insert({ event, userId, docId, createdAt, data });
    // After
    notificationEventsController.after(eventsParams);
  }
}
