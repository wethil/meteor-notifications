ServerNotifications = class {
  constructor(name)
  {
    this.name       = name;
    this.collection = new Mongo.Collection("notifications_" + this.name);
    this._ensureIndexes();
    this._startPublication();
    return this;
  }

  _ensureIndexes()
  {
    this.collection._ensureIndex("intendedFor");
    this.collection._ensureIndex("date");
    this.collection._ensureIndex("subject");
  }

  _startPublication()
  {
    Meteor.publish(`notifications/${this.name}/publication`, (intendedFor, startingFrom) =>
    {
      return this.collection.find({
        intendedFor, date: {$gt: startingFrom}, delivered: 0
      });
    });
  }

  notify(subject, title, message, intendedFor, options = {})
  {
    this.collection.insert({
      subject, title, message, intendedFor, options, date: new Date(), delivered: 0
    });
  }
}