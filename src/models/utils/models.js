const moment = require('moment');

const ModelsUtils = {

  getter(date) {

    if (date) {
      return moment(date);
    }
  },

  setter(date) {

    if (!date) {
      return null;
    }

    return moment.isMoment(date) ? date.format() : moment(date).format()
  },

  filterByDate(opts = {}, prop = '') {

    let params = {};

    if (opts.fromDate && !opts.toDate) {
      params[prop] = {$gte: moment(opts.fromDate).startOf('day').toDate()};
    }

    if (opts.toDate && !opts.fromDate) {
      params[prop] = {$lte: moment(opts.toDate).endOf('day').toDate()};
    }

    if (opts.toDate && opts.fromDate) {
      params[prop] = {
        $gte: moment(opts.fromDate).startOf('day').toDate(),
        $lte: moment(opts.toDate).endOf('day').toDate()
      };
    }

    return params;
  },

};

module.exports = ModelsUtils;
