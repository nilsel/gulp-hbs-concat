![status](https://secure.travis-ci.org/nilsel/gulp-hbs-concat.png?branch=master)

## Information

<table>
<tr>
<td>Package</td><td>gulp-hbs-concat</td>
</tr>
<tr>
<td>Description</td>
<td>Concatenates handlebars templates into a js file</td>
</tr>
<tr>
<td>Node Version</td>
<td>>= 0.10</td>
</tr>
</table>

## Fork notice (blatant copy, broke all the tests)
This is a fork of [gulp-concat](https://github.com/wearefractal/gulp-concat) and does this:

Concatenates handlebars/mustache templates into a single .js file, where template files are mapped to a global template object (based on the filename of the template).

The reasoning is that we want to interpolate variables and texts (which comes from a rest-api), and compile the templates at runtime in the browser. Also, we need to strip newlines and whitespace from our templates (to make it fit inside a javascript string) I could not find a gulp-plugin to do exactly (and only) this, so then we fork! :)

#### Warning! Beginners mind! I'm a newbie to gulp, streams and stuff. This might not work as expected.

### templates.js:
```javascript
// result will be something like this:
MyApp.templates["welcome"] = 'Welcome {{user.name}}!';
MyApp.templates["goodbye"] = 'Goodbye {{user.name}}!';
// then it's up to you to parse/compile the templates in JS
// psuedo-code example (MyApp.parse wraps Handlebars.compile()):
var data = {
  user: {
    name: 'Hal'
  }
}
var welcomeHtml = MyApp.parse(MyApp.templates.welcome, data);
$('body').append(welcomeHtml);
// such amaze!
```

## Usage

```javascript
var concat = require('gulp-hbs-concat');

gulp.task('templates', function(){
  gulp.src('paths/glob to templates')
    .pipe(hbsconcat('templates.js', {newLine: '\n', prefix: 'MyApp.templates', postfix: ';'}))
    .pipe(gulp.dest('js/src/'));
});
// templates.js should now be baked with uglify
```

This will concat files by your operating systems newLine. It will take the base directory from the first file that passes through it.

Files will be concatenated in the order that they are specified in the `gulp.src` function. For example, to concat `./lib/file3.js`, `./lib/file1.js` and `./lib/file2.js` in that order, the following code will create a task to do that:

```javascript
var concat = require('gulp-concat');

gulp.task('scripts', function() {
  gulp.src(['./lib/file3.js', './lib/file1.js', './lib/file2.js'])
    .pipe(concat('all.js'))
    .pipe(gulp.dest('./dist/'))
});
```

To change the newLine simply pass an object as the second argument to concat with newLine being whatever (\r\n if you want to support any OS to look at it)

For instance:

```
.pipe(concat('main.js', {newLine: ';'}))
```


## LICENSE

(MIT License)

Copyright (c) 2014 Fractal <contact@wearefractal.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
