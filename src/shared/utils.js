// byte单位转换
export const changeByte = (byte) => {
  try {
    let size = '';
    if (byte < 0.1 * 1024 && byte) {
      // 小于0.1KB，则转化成B
      size = `${byte.toFixed(2)}B`;
    } else if (byte < 0.1 * 1024 * 1024) {
      // 小于0.1MB，则转化成KB
      size = `${(byte / 1024).toFixed(2)}KB`;
    } else if (byte < 0.1 * 1024 * 1024 * 1024) {
      // 小于0.1GB，则转化成MB
      size = `${(byte / (1024 * 1024)).toFixed(2)}MB`;
    } else {
      // 其他转化成GB
      size = `${(byte / (1024 * 1024 * 1024)).toFixed(2)}GB`;
    }
    const sizeStr = `${size}`; // 转成字符串
    const index = sizeStr.indexOf('.'); // 获取小数点处的索引
    const dou = sizeStr.substr(index + 1, 2); // 获取小数点后两位的值
    // eslint-disable-next-line eqeqeq
    if (dou == '00') {
      // 判断后两位是否为00，如果是则删除00
      return sizeStr.substring(0, index) + sizeStr.substr(index + 3, 2);
    }
    return size;
  } catch (error) {
    return `${byte}B`;
  }
};

// 字符串大小计算
export const strSize = (str, charset) => {
  let total = 0;
  charset = charset?.toLowerCase() || '';
  for (let i = 0; i < str.length; i++) {
    let charCode = str.charCodeAt(i);
    if (charset === 'utf-16' || charset === 'utf16') {
      total += charCode <= 0xffff ? 2 : 4;
    } else {
      if (charCode <= 0x007f) {
        total += 1;
      } else if (charCode <= 0x07ff) {
        total += 2;
      } else if (charCode <= 0xffff) {
        total += 3;
      } else {
        total += 4;
      }
    }
  }
  return total;
};

// 实现HTML标签转义
export const escapeHtml = function escapeHtml(html) {
  let temp = document.createElement('div');
  temp.textContent != null
    ? (temp.textContent = html)
    : (temp.innerText = html);
  let output = temp.innerHTML;
  temp = null;
  return output;
};
