/**
 * 实现可读流
 * 支持data/open/close/error事件
 * 支持pause/resume 方法
 */

const EventEmitter = require('events');
const fs = require('fs');


class fsCreateReadStream extends EventEmitter {
  constructor(path, options) {
    super();
    // path is must be a path string.
    if (!path || typeof path !== 'string') {
      this.emit('error', new Error('path is required as a path string'));
    }
    this.path = path;
    this.flags = options.flags || 'r';
    this.highWaterMark = options.highWaterMark || 16;
    this.start = options.start || 0;
    this.posi = this.start;
    this.end = options.end || null;
    this.autoClose = options.autoClose !== false;
    this.encoding = options.encoding || null;
    // create a buffer to Avoid duplicate creation.
    this.buffer = Buffer.alloc(this.highWaterMark);

    this.open();

    this.on('newListener', (event, listener) => {
      if (event === 'data') {
        // flowing mode.
        this.flowing = true;
        this.read();
      }
    });

  }

  read() {
    // not open file yet. wait this open functionemit the open event.
    if (typeof this.fd !== 'number') {
      this.once('open', () => {
        this.read();
      });
      return;
    }
    // if has the end flag. need computed read how much bytes.
    const howMuchToRead = this.end ? Math.min(this.highWaterMark, this.end - this.posi) : this.highWaterMark;
    fs.read(this.fd, this.buffer, 0, howMuchToRead, this.posi, (err, bytesRead, buffer) => {
      if (err) {
        this.emit('error', err);
        this.destory();
        return;
      }
      if (bytesRead > 0) {
        // move the posi.
        this.posi += bytesRead;
        // Aviod the previous buffer data
        buffer = buffer.slice(0, bytesRead);
        const data = this.encoding ? buffer.toString(this.encoding) : buffer;
        this.emit('data', data);
        if (this.end && this.posi > this.end) {
          this.emit('end');
          this.destory();
        }
        // flow mode
        if (this.flowing) {
          this.read();
        }
        return;
      }
      this.emit('end');
      this.destory();
    });
  }
  pause() {
    this.flowing = false;
  }
  resume() {
    this.flowing = true;
    this.read();
  }
  open() {
    fs.open(this.path, this.flags, (err, fd) => {
      if (err) {
        this.emit('error', err);
        if (this.autoClose) {
          this.destory();
        }
        return;
      }
      this.fd = fd;
      this.emit('open', this.fd);

    });
  }
  destory() {
    if (typeof this.fd === 'number') {
      fs.close(this.fd, () => {
        this.emit('close');
      });
      return;
    }
    this.emit('close');
  }

}

function createReadStream() {
  return new fs.ReadStream(...arguments);
}

module.exports = { createReadStream };