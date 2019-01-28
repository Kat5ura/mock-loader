# Mock Loader
Mock loader for webpack

这个 loader 搭配 mockjs 一起使用。

## Install

```bash
# 目前还没发布
npm i mock-loader --save-dev
```

## Usage

**webpack.config.js**
```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.entry\.js$/,
        loader: ['mock-loader'],
        options: {
          config: {
            './root/to/path/entry.js': './root/to/mock/*.js'
          }
        }
      }
    ]
  }
}
```

## Options

|Name|Type|Default|Description|
|:--:|:--:|:-----:|:----------|
|**`config`**|`{Object}`|`undefined`|配置要引入 mock 的入口以及对应的 mock 文件|
|**`parser`**|`{Function}`|`undefined`|可以传入自定义 parser|
|**`disabled`**|`{Booleam}`|`false`|是否关闭 mock|

### `config`

配置好，你想要进行 mock 的页面入口地址，以及对应的 mock 文件。 如下：

**webpack.config.js**
```js
{
  loader: 'mock-loader',
  options: {
    config: {
      './root/to/path/entry.js': './root/to/mock/*.js'
    }
  }
}
```

> 注意：
>   1. key 代表入口文件地址，是相对于 `process.cwd()` 的.
>   2. value 代表 mock 文件地址，或者地址的数组，也是相对于 `process.cwd()` 的.
>   3. value 支持匹配，这里使用 `glob` 进行文件匹配

### `parser`

自定义 parser

```js
/**
* parser
* @param content 传入 loader 的文件内容
* @param files 根据 config.value 所匹配到的文件绝对路径 
*/
function parser(content, files) {
  // 做一些事情
  // this ==> 这里的 this， 属于 loader
  return content;
}
```

**webpack.config.js**
```js
{
  loader: 'mock-loader',
  options: {
    parser: parser
  }
}
```


### `disabled`

你可以设置是否关闭 mock， 默认是 `false`

**webpack.config.js**
```js
{
  loader: 'mock-loader',
  options: {
    disabled: true
  }
}
```

## Example

下面使用一个实例工程来说明如何使用 mock-loader

### 项目的入口文件 `src/index.js`

```js
    // 这里简单打印一个 hello world
    console.log('Hello World');
```

### mock 文件 `mock/mock-json.js`

```js
    const Mock = require('mockjs');
    module.exports = function() {
      Mock.mock(/\.json$/, {
        'list|1-10': [{
                    'id|+1': 1,
                    'email': '@EMAIL'
                }]
      })
    };
```

### `webpack.config.js`

```js
    /////// require 各种库
    module.exports = {
        module: {
            rules: [
                {
                    test: /main\.js$/,
                    enforce: "pre",
                    use: [{
                        loader: 'mock-loader',
                        options: {
                            config: {
                                './src/index.js': './mock/*.js' // ['./mock/*.js', './other/*.js']
                            },
                        }
                    }]
                }
            ]
        },
    };
```

### 运行 webpack 打包之后，你会看到

```js
    require('../mock/mock-json.js')();console.log('Hello world!');
```

至此我们已经可以愉快的 mock 了！
