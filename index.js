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
    noNewLines = file.contents.toString();

    // strip newlines and whitespace
    noNewLines = noNewLines.replace(/[\n\r\t\f]/gmi, '').replace(/[\s]{2,8}/gi, '');

    // output our custom SB.templates['name'] = '...' syntax
    // TODO: better handling of options
    if(opt.prefix !== '' && opt.postfix !== ''){
      noNewLines = opt.prefix + '["'+filename+'"] = ' + '\''+noNewLines+'\'' + opt.postfix;
    }

    var noNewLineBuffer = new Buffer(noNewLines);

    buffer.push(noNewLineBuffer);
    // buffer.push(file.contents);
  }

  function endStream() {
    if (buffer.length === 0) return this.emit('end');

    var joinedContents = Buffer.concat(buffer);

    var joinedPath = path.join(firstFile.base, fileName);

    var joinedFile = new File({
      cwd: firstFile.cwd,
      base: firstFile.base,
      path: joinedPath,
      contents: joinedContents
    });

    this.emit('data', joinedFile);
    this.emit('end');
  }

  return through(bufferContents, endStream);
};
