import * as Cesium from 'cesium';

/**
 * 经纬度坐标转高德瓦片坐标
 * @param lng
 * @param lat
 * @param level 缩放等级
 * @returns TileXY [tileX, tileY]
 */
export const lngLatToTileXY = (lng, lat, level) => {
  const tileX = Math.floor(((lng + 180) / 360) * Math.pow(2, level));
  const tileY = Math.floor(
    (1 / 2 -
      Math.log(
        Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)
      ) /
        (2 * Math.PI)) *
      Math.pow(2, level)
  );
  return [tileX, tileY];
};

/**
 * 经纬度转瓦片内像素坐标
 * @param lng
 * @param lat
 * @param level 缩放等级
 * @returns PixelXY [pixelX, pixelY]
 */
const lngLatToPixelXY = (lng, lat, level) => {
  const pixelX = Math.floor(
    (((lng + 180) / 360) * Math.pow(2, level) * 256) % 256
  );
  const pixelY = Math.floor(
    ((1 -
      Math.log(
        Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)
      ) /
        (2 * Math.PI)) *
      Math.pow(2, level) *
      256) %
      256
  );
  return [pixelX, pixelY];
};

/**
 * 获取Bing Map MetaData
 * @link https://docs.microsoft.com/en-us/bingmaps/rest-services/imagery/get-imagery-metadata
 * @returns metadata(json)
 */
const getBingMeta = async () => {
  const BING_KEY =
    'Al39BHMrIUKkzRBWXLk09Hqd2fsIXhVlyEvYKu2QhOg41oK2kE0rigtShwIAWw1o'; //Fix:https://learn.microsoft.com/en-us/bingmaps/getting-started/bing-maps-dev-center-help/getting-a-bing-maps-key

  const req = await fetch(
    'https://dev.virtualearth.net/REST/v1/Imagery/Metadata/Aerial?key=' +
      BING_KEY
  );

  const jsonData = await req.json();

  return jsonData;
};

/**
 * 获取Bing Map瓦片URL
 * @return url(string)
 */
const getBingTileURL = async () => {
  let meta = await getBingMeta();
  let url = meta.resourceSets[0].resources[0].imageUrl;
  return url.replace('{subdomain}', 't1');
};

/**
 * 获取瓦片图片信息并且拼接
 * @param ltxy 左上坐标
 * @param rbxy 右下坐标
 * @param ltpixelXY 左上像点坐标
 * @param rbpixelXY 右下像点坐标
 * @param nowzoom 当前缩放等级
 * @param map 地图种类
 */
const getTileImg = async (ltxy, rbxy, ltpixelXY, rbpixelXY, nowzoom, map) => {
  // const TILE_SIZE = 256; //高德瓦片尺寸

  const imgcanvas = document.createElement('canvas');
  const context = imgcanvas.getContext('2d');

  //canvas宽高初始化
  imgcanvas.width = 256 * (rbxy[0] - ltxy[0] + 1);
  imgcanvas.height = 256 * (rbxy[1] - ltxy[1] + 1);
  let finflag = 0; //瓦片获取完毕标志
  let getWMTSURL;

  switch (map) {
    case '天地图影像':
      getWMTSURL = (m, n) => {
        return (
          'http://t0.tianditu.gov.cn/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix=' +
          nowzoom.toString() +
          '&TileRow=' +
          n.toString() +
          '&TileCol=' +
          m.toString() +
          '&style=default&format=tiles&tk=5c64e3d39ec181832df33eb6125ecc89'
        );
      };
      break;
    case 'Virtual Earth影像':
      let bingTileURL = await getBingTileURL();
      getWMTSURL = (m, n) => {
        let quadkey = Cesium.BingMapsImageryProvider.tileXYToQuadKey(
          m,
          n,
          nowzoom
        );
        quadkey = quadkey.substr(1, quadkey.length);

        let turl = bingTileURL.replace('{quadkey}', quadkey);

        return turl;
      };
      break;
    default:
      getWMTSURL = (m, n) => {
        return (
          'https://webst04.is.autonavi.com/appmaptile?style=6&x=' +
          m.toString() +
          '&y=' +
          n.toString() +
          '&z=' +
          nowzoom.toString()
        );
      };
      break;
  }

  //没有rbxy[0]+1的话会出现最后一张瓦片缺失的情况，为img未完全加载问题，稍微改了下，多了个判断
  //TODO:加载速度太慢

  l1: for (let m = ltxy[0]; m <= rbxy[0] + 1; m++) {
    for (let n = ltxy[1]; n <= rbxy[1]; n++) {
      if (finflag === 1) {
        break l1;
      }

      const req = await fetch(getWMTSURL(m, n), {
        headers: {
          accept:
            'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
          'sec-fetch-dest': 'image',
        },
      });

      const tempblob = await req.blob();

      const tempimg = new Image();
      tempimg.crossOrigin = '';
      const tempurl = URL.createObjectURL(tempblob);
      tempimg.src = tempurl;

      tempimg.onload = () => {
        context?.drawImage(tempimg, (m - ltxy[0]) * 256, (n - ltxy[1]) * 256);
      };

      if (m === rbxy[0] && n === rbxy[1]) {
        finflag = 1;
      }
    }
  }

  const sx = ltpixelXY[0];
  const sy = ltpixelXY[1];

  const widmid = () => {
    const n = rbxy[0] - ltxy[0] - 1; //+1-2
    if (n < 0) {
      return 0;
    } else {
      return n;
    }
  };

  const heimid = () => {
    const n = rbxy[1] - ltxy[1] - 1; //+1-2
    if (n < 0) {
      return 0;
    } else {
      return n;
    }
  };

  let swidth;
  let sheight;
  if (rbxy[0] === ltxy[0]) {
    swidth = rbpixelXY[0] - ltpixelXY[0];
  } else {
    swidth = 256 - ltpixelXY[0] + widmid() * 256 + rbpixelXY[0];
  }

  if (rbxy[1] === ltxy[1]) {
    sheight = rbpixelXY[1] - ltpixelXY[1];
  } else {
    sheight = 256 - ltpixelXY[1] + heimid() * 256 + rbpixelXY[1];
  }

  //裁剪
  const fullimg = new Image();

  fullimg.src = imgcanvas.toDataURL('image/png');
  const clipcanvas = document.createElement('canvas');
  const ctx = clipcanvas.getContext('2d');
  clipcanvas.width = swidth;
  clipcanvas.height = sheight;

  return new Promise((resolve) => {
    fullimg.onload = function () {
      ctx?.drawImage(fullimg, sx, sy, swidth, sheight, 0, 0, swidth, sheight);
      clipcanvas.toBlob((blob) => {
        resolve(blob);
      });
    };
  });
};

/**
 * 矩形区域转图像
 * @param ltpoints 左上点经纬度
 * @param rbpoints 右下点经纬度
 * @param zoomlv 图像的缩放等级
 */
export const rectToImg = async (ltpoint, rbpoint, zoomlv, map) => {
  //左上角，右下角
  const ltxy = lngLatToTileXY(ltpoint[0], ltpoint[1], zoomlv);
  const rbxy = lngLatToTileXY(rbpoint[0], rbpoint[1], zoomlv);
  const ltpixelXY = lngLatToPixelXY(ltpoint[0], ltpoint[1], zoomlv);
  const rbpixelXY = lngLatToPixelXY(rbpoint[0], rbpoint[1], zoomlv);

  //TODO:需要加入RECT大小限制检测
  const tileImg = await getTileImg(
    ltxy,
    rbxy,
    ltpixelXY,
    rbpixelXY,
    zoomlv,
    map
  );

  return tileImg;
};
