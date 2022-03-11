const _ = require('lodash');
const pick = require('lodash.pick');

module.exports = (mongoose) => {
  let coinSchema = mongoose.Schema(
    {
      name: { type: String, lowercase: true, required: true },
      code: { type: String, uppercase: true, required: true, unique: true },
      price: { type: Number, default: 0 },
      fetchedTime: { type: Date, default: Date.now },
      isActive: { type: Boolean, default: true },
    },
    {
      timestamps: true,
    }
  );

  coinSchema.index({ createdAt: 1 });

  coinSchema.statics = {
    /**
     * Create
     * @param {Object} Raw Coin
     * @return {Object} Model Coin
     */
    create: async function (rawCoin, tOpts) {
      const rawObj = this.model('coin')(rawCoin);

      return rawObj.save(tOpts);
    },

    /**
     * Find By coin code
     * @param {String} coinCode
     * @return {Object} Model Coin
     */
    findByCoinCode: async function (coinCode) {
      return this.model('coin').findOne({ code: coinCode.toLowerCase() }).exec();
    },
  };

  coinSchema.methods = {
    /**
     * Reload Document
     */
    reload: async function (tOpts = {}) {
      return this.model('coin').findOne({ _id: this._id }).exec(tOpts);
    },

    /**
     * update
     * @param {Object} Params
     * @return {Object} Model coin
     */
    update: async function (params = {}, tOpts = {}) {
      Object.entries(params).forEach(([key, value]) => {
        if (this.schema.tree[key]) {
          if (
            !this.schema.tree[key].required ||
            (this.schema.tree[key].required && value)
          ) {
            const parsedObj = this.toObject();

            if (!_.isEqual(parsedObj[key], value)) {
              this[key] = value;
            }
          }
        }
      });

      await this.save(tOpts);

      return this.reload(tOpts);
    },

    /**
     * Filter Keys
     * @return {Object} Custom Keys
     */
    filterKeys: function () {
      const obj = this.toObject();

      const filtered = pick(obj, '_id', 'name', 'code', 'price', 'fetchedTime', 'isActive');

      return filtered;
    },
  };

  return mongoose.model('coin', coinSchema);
};
