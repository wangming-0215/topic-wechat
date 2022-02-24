// index.js
// 获取应用实例
const app = getApp();

/**
 * 格式化字符串
 *
 * format('Hello {0}, How are you?', 'Harry') => Hello Harry, How are you?
 *
 * @param {*} str
 * @param  {...any} rest
 */
function format(str, ...rest) {
  return str.replace(/\{([^\{\}]+)\}/g, (tag, name) => {
    return rest[name];
  });
}

Page({
  data: {
    value: '',
    cached: [],
    currentCursor: 0,
  },
  onInput(event) {
    console.log(event);
    const { value, cursor, keyCode } = event.detail; // keyCode 在开发工具中无法返回，真机测试可以
    console.log(keyCode);
    if (keyCode === 8) {
      // ios 键盘删除键 keyCode 是 8，其他系统/第三方输入法未测试
      this.removeItem(event);
    } else {
      // 正常输入
      this.setData({
        value,
        currentCursor: cursor,
      });
    }
  },

  findItemToRemove(cursor) {
    return this.data.cached.filter(
      (item) => cursor > item.start && cursor < item.end - 1
    );
  },

  removeItem(event) {
    const { value, cursor } = event.detail;
    const item = this.findItemToRemove(cursor);
    if (item.length > 0) {
      const nextValue =
        this.data.value.slice(0, item[0].start) +
        this.data.value.slice(item[0].end);
      this.setData({
        value: nextValue,
        cached: this.data.cached.filter((t) => t.id !== item[0].id),
        currentCursor: item[0].start,
      });
    } else {
      this.setData({ value, currentCursor: cursor });
    }
  },

  onAddTopic() {
    // 添加主题
    const content = '周杰伦';
    const formatted = ` #${content}# `;
    const topic = {
      id: Math.round(Math.random() * 1000),
      type: 'topic',
      start: this.data.currentCursor,
      end: this.data.currentCursor + formatted.length,
      content,
    };

    const { value: prevValue, cached: prevCached } = this.data;

    this.setData({
      value: prevValue + formatted,
      currentCursor: topic.end,
      cached: [...prevCached, topic],
    });
  },

  submit() {},
});
