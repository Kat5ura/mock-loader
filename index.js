const path = require('path');
const getOptions = require('loader-utils').getOptions;
const validateOptions = require('schema-utils');
const glob = require('glob');

const schema = {
  type: 'object',
  properties: {
    config: {
      type: 'object'
    },

    parser: {
      instanceof: "Function"
    },

    disabled: {
      type: 'boolean'
    }
  },
  additionalProperties: false
};


module.exports = function (content) {
  let options = getOptions(this);
  validateOptions(schema, options, 'Mock Loader');

  // 如果disable设置为true，则直接返回原始代码
  if (options.disabled) {
    return content;
  }

  let config = options.config;

  let currentPath = this.resourcePath;
  let currentMock = [];

  Object.keys(config).forEach((entryStr) => {
    let entry = path.resolve(process.cwd(), entryStr);
    if (currentPath === entry) {
      let cur = config[entryStr];
      if (typeof cur === 'string') {
        currentMock = [cur];
      }

      if (Array.isArray(cur)) {
        currentMock = cur;
      }
    }
  });

  let mockFiles = [];
  currentMock.forEach(mock => {
    let files = glob.sync(mock, {}) || [];
    if (files.length) {
      mockFiles = [].concat(mockFiles, files);
    }
  });

  const parser = (options.parser || defaultParser);

  return parser.apply(this, [content, mockFiles]);
};

function defaultParser(content, files) {
  let currentPath = this.resourcePath;
  const requireArr = files.map(file => {
    let itemPath = path.resolve(process.cwd(), file);
    return `require('./${path.relative(path.dirname(currentPath), itemPath)}')();`
  });
  return requireArr.join('\n') + content;
}
