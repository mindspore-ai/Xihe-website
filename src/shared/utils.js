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
export function escapeHtml(html) {
  let temp = document.createElement('div');
  temp.textContent !== null
    ? (temp.textContent = html)
    : (temp.innerText = html);
  let output = temp.innerHTML;
  temp = null;
  return output;
}

export function fileToBase64(file, callback) {
  const fileReader = new FileReader();
  fileReader.readAsDataURL(file);
  fileReader.onload = function () {
    callback(this.result);
  };
}

export function dataURLtoBlob(dataurl) {
  let arr = dataurl.split(',');
  let array = arr[0].match(/:(.*?);/);
  let mime = (array && array.length > 1 ? array[1] : '') || '';
  // 去掉url的头，并转化为byte
  let bytes = decodeURIComponent(
    escape(window.atob(arr[1].replace(/-/g, '+').replace(/_/g, '/')))
  );
  // 处理异常,将ascii码小于0的转换为大于0
  let ab = new ArrayBuffer(bytes.length);
  // 生成视图（直接针对内存）：8位无符号整数，长度1个字节
  let ia = new Uint8Array(ab);
  for (let i = 0; i < bytes.length; i++) {
    ia[i] = bytes.charCodeAt(i);
  }
  return new Blob([ab], {
    type: mime,
  });
}

export function formatDateTime(inputTime) {
  let date = new Date(inputTime);
  let y = date.getFullYear();
  let m = date.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  let d = date.getDate();
  d = d < 10 ? '0' + d : d;
  let h = date.getHours();
  h = h < 10 ? '0' + h : h;
  let minute = date.getMinutes();
  let second = date.getSeconds();
  minute = minute < 10 ? '0' + minute : minute;
  second = second < 10 ? '0' + second : second;
  return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
}

export function formatSeconds(value) {
  let second = value; // 秒
  let minute = 0; // 分
  let hour = 0; // 小时
  if (second > 59) {
    minute = parseInt(second / 60);
    second = parseInt(second % 60);
  }
  if (minute > 59) {
    hour = parseInt(minute / 60);
    minute = parseInt(minute % 60);
  }
  second = second < 10 ? '0' + second : second;
  minute = minute < 10 ? '0' + minute : minute;
  hour = hour < 10 ? '0' + hour : hour;
  return hour + ':' + minute + ':' + second;
}

// 时间戳转时间格式
export function timestampToTime(timestamp) {
  let date = new Date(timestamp * 1000); // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
  let Y = date.getFullYear() + '-';
  let M =
    (date.getMonth() + 1 < 10
      ? '0' + (date.getMonth() + 1)
      : date.getMonth() + 1) + '-';
  let D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
  let h =
    (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
  let m =
    (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) +
    ':';
  let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
  return Y + M + D + h + m + s;
}
