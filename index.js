var through = require('through');
var path = require('path');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var File = gutil.File;
var Buffer = require('buffer').Buffer;


module.exports = function(fileName, opt) {

  if (!fileName) throw new PluginError('gulp-hbs-concat', 'Missing fileName option for gulp-hbs-concat');
  if (!opt) opt = {};
  // quick&dirty check for options
  if(!opt.hasOwnProperty('prefix')){ opt.prefix = ''; }
  if(!opt.hasOwnProperty('postfix')){ opt.prefix = ''; }
  // add outer-wrapping code so we can support cjs/umd
  if(!opt.hasOwnProperty('wrapper_start')){ opt.wrapper_start = ''; }
  if(!opt.hasOwnProperty('wrapper_stop')){ opt.wrapper_stop = ''; }

  // to preserve existing |undefined| behaviour and to introduce |newLine: ""| for binaries
  if (typeof opt.newLine !== 'string') opt.newLine = gutil.linefeed;

  var buffer = [];
  var firstFile = null;
  var newLineBuffer = opt.newLine ? new Buffer(opt.newLine) : null;
  var noNewLines, filename;

  function bufferContents(file) {
    if (file.isNull()) return; // ignore
    if (file.isStream()) return this.emit('error', new PluginError('gulp-hbs-concat',  'Streaming not supported'));

    if (!firstFile){
      firstFile = file;
    }

    filename = file.path.split(path.sep).pop().split('.')[0];
    flatLines = file.contents.toString();

    // strip newlines and whitespace (only if between 3 and 8 spaces)
    flatLines = flatLines.replace(/[\n\r\t\f]/gmi, '').replace(/[\s]{2,8}/gi, '');

    // output custom "templatename": '...' syntax
    // TODO: better handling of options, way too hardcoded this way
    flatLines = opt.prefix + '"'+filename+'": ' + '\''+flatLines+'\'' + opt.postfix + opt.newLine;

    var finalizedBuffer = new Buffer(flatLines);

    buffer.push(finalizedBuffer);
    // buffer.push(file.contents);
  }

  function endStream() {
    if (buffer.length === 0) return this.emit('end');

    var finalOutput = opt.wrapper_start + buffer.toString() + opt.wrapper_stop;
    var finalBuffer = new Buffer(finalOutput);

    var joinedPath = path.join(firstFile.base, fileName);

    var joinedFile = new File({
      cwd: firstFile.cwd,
      base: firstFile.base,
      path: joinedPath,
      contents: finalBuffer
    });

    this.emit('data', joinedFile);
    this.emit('end');
  }

  return through(bufferContents, endStream);
};
