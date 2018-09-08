function S4 () {
  return (((1 + Math.random ()) * 0x10000) | 0).toString (16).substring (1);
}

const common = {
  // 生成guid
  guid () {
    return (
      S4 () +
      S4 () +
      '-' +
      S4 () +
      '-' +
      S4 () +
      '-' +
      S4 () +
      '-' +
      S4 () +
      S4 () +
      S4 ()
    );
  },
  /**
   * 数组原型扩展
   */
  useArrayExtends () {
    // 数组原型扩展
    Array.prototype.remove = function (where) {
      this.filter (where).forEach (r => {
        var index = this.indexOf (r);
        this.splice (index, 1);
      });
    };
  },
};

export default common;
