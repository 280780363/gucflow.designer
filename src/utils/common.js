function S4 () {
  return (((1 + Math.random ()) * 0x10000) | 0).toString (16).substring (1);
}

const common = {
  /**
   * 生成随机guid
   */
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
   * 对象设为只读
   */
  readonly (obj) {
    if (!obj) return;
    if (typeof obj != 'object') return;
    Object.freeze (obj);
    for (let key in obj) {
      if (typeof obj[key] === 'object') Object.freeze (obj[key]);
      common.readonly (obj[key]);
    }
  },
  /**
   * 原型扩展
   */
  useExtends () {
    /**
     * 根据条件移除元素
     * @param {function} where 
     */
    Array.prototype.remove = function (where) {
      this.filter (where).forEach (r => {
        var index = this.indexOf (r);
        this.splice (index, 1);
      });
    };

    /**
     * 获取第一个元素
     */
    Array.prototype.first = function () {
      if (!this.length) return null;
      return this[0];
    };
    
    /**
     * 获取最后一个元素
     */
    Array.prototype.last = function () {
      if (!this.length) return null;
      return this[this.length - 1];
    };

    /**
     * 如果字符串超过长度,则截取
     * @param {int}} length 
     */
    String.prototype.substringIfTooLong = function (length) {
      if (!this) return '';
      if (this.length <= length) return this;
      return this.substring (0, length) + '...';
    };
  },
  /**
   * 深克隆对象或数组
   * @param {object} obj 
   */
  clone (obj) {
    let cloned = {};
    for (let key in obj) {
      if (typeof obj[key] != 'object')
        // 值类型 复制
        cloned[key] = obj[key];
      else if (obj[key] instanceof Array) {
        let cloneArray = [];
        for (let i = 0; i < obj[key].length; i++) {
          let current = obj[key][i];
          if (typeof current != 'object') cloneArray.push (current);
          else cloneArray.push (common.clone (current));
        }
        cloned[key] = cloneArray;
      } else cloned[key] = common.clone (obj[key]);
    }
    return cloned;
  },
};

export default common;
