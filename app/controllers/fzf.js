const {HttpError} = require('../routes/tool/error');

const fzf = async (ctx, next) => {
  throw new HttpError(404);
};

module.exports = {fzf};
