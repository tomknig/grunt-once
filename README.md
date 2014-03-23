# grunt-once

> Open HTML files with PhantomJS and renders their DOM into a new file when `window.isRenderable` is set to `true`.

## Usage

### The "once" task
In your project's Gruntfile, add a section named `once` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  once: {
    your_target: {
      src: 'your.html',
      dest: 'build/your.html'
    },
  },
});
```

### Your html
grunt-once will only render the page when the property `window.isRenderable` is set to `true`.
Introduce this variable in your script and make sure to set it to `true` when the renderable DOM changes are done.

```js
function manipulateDOM() {
	document.createElement( ... );
	
	{{your code}}

	window.isRenderable = true;
}

window.onload = manipulateDOM;
```

## Getting Started with Grunt

This plugin requires Grunt `~0.4.4`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-once --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-once');
```

## Contact

[Tom König](http://github.com/TomKnig) [@TomKnig](https://twitter.com/TomKnig)

## License

grunt-once is available under the MIT license. See the LICENSE file for more info.
