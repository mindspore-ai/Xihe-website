window.CESIUM_BASE_URL = '/lib/Cesium/';

import * as Cesium from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';
import { DrawRect, guid } from './drawrect';
import publicUrl from '@/shared/modelzoo/luojia/public-address';

// 初始视角更改
Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(
  75.0, // 东
  0.0, // 南
  140.0, // 西
  60.0 // 北
);

Cesium.Ion.defaultAccessToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxNTFlNWVmMC1jOWRhLTQyMDktOTY4Ny02YTU5YWFlMGYwY2IiLCJpZCI6OTQzNDQsImlhdCI6MTY1Mjg4ODEyNn0.g2vq1qq_rdfZeRTy73nBkEDzhMIM4upkYcbIdFYnCiQ';

// 设置天地图token
const tdtkey = '3a696e02b3d443d903ed577690be0c8b'; // Fix:http://lbs.tianditu.gov.cn/authorization/authorization.html

// 天地图URL配置
const TDTURL_CONFIG = {
  TDT_IMG_W:
    'https://{s}.tianditu.gov.cn/img_w/wmts?service=wmts&request=GetTile&version=1.0.0' +
    '&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}' +
    '&style=default&format=tiles&tk=' +
    tdtkey, // 在线天地图影像服务地址(墨卡托投影)
  TDT_VEC_W:
    'https://{s}.tianditu.gov.cn/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0' +
    '&LAYER=vec&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}' +
    '&style=default&format=tiles&tk=' +
    tdtkey, // 在线天地图矢量地图服务(墨卡托投影)
  TDT_CIA_W:
    'https://{s}.tianditu.gov.cn/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0' +
    '&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}' +
    '&style=default.jpg&tk=' +
    tdtkey, // 在线天地图影像中文标记服务(墨卡托投影)
  TDT_CVA_W:
    'https://{s}.tianditu.gov.cn/cva_w/wmts?service=wmts&request=GetTile&version=1.0.0' +
    '&LAYER=cva&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}' +
    '&style=default.jpg&tk=' +
    tdtkey, // 在线天地图矢量中文标记服务(墨卡托投影)
  TDT_IMG_C:
    'https://{s}.tianditu.gov.cn/img_c/wmts?service=wmts&request=GetTile&version=1.0.0' +
    '&LAYER=img&tileMatrixSet=c&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}' +
    '&style=default&format=tiles&tk=' +
    tdtkey, // 在线天地图影像服务地址(经纬度)
  TDT_VEC_C:
    'https://{s}.tianditu.gov.cn/vec_c/wmts?service=wmts&request=GetTile&version=1.0.0' +
    '&LAYER=vec&tileMatrixSet=c&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}' +
    '&style=default&format=tiles&tk=' +
    tdtkey, // 在线天地图矢量地图服务(经纬度)
  TDT_CIA_C:
    'https://{s}.tianditu.gov.cn/cia_c/wmts?service=wmts&request=GetTile&version=1.0.0' +
    '&LAYER=cia&tileMatrixSet=c&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}' +
    '&style=default&format=tiles&tk=' +
    tdtkey, // 在线天地图影像中文标记服务(经纬度)
  TDT_CVA_C:
    'https://{s}.tianditu.gov.cn/cva_c/wmts?service=wmts&request=GetTile&version=1.0.0' +
    '&LAYER=cva&tileMatrixSet=c&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}' +
    '&style=default&format=tiles&tk=' +
    tdtkey, // 在线天地图矢量中文标记服务(经纬度)
  TDT_IBO_C:
    'https://{s}.tianditu.gov.cn/ibo_c/wmts?service=wmts&request=GetTile&version=1.0.0' +
    '&LAYER=cva&tileMatrixSet=c&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}' +
    '&style=default&format=tiles&tk=' +
    tdtkey, // 在线天地图全球境界服务(经纬度)
};

// 高德地图URL配置
const AMAPURL_CONFIG = {
  // 在线高德地图影像服务地址
  AMAP_IMG:
    'https://webst{s}.is.autonavi.com/appmaptile?style=6&x={TileCol}&y={TileRow}&z={TileMatrix}',
  // 在线高德地图影像中文标记服务
  AMAP_IMG_CIA:
    'https://webst{s}.is.autonavi.com/appmaptile?style=8&x={TileCol}&y={TileRow}&z={TileMatrix}',
  AMAP_IMG_NEW:
    'http://wprd{s}.is.autonavi.com/appmaptile?x={TileCol}&y={TileRow}&z={TileMatrix}&lang=zh_cn&size=1&scl=2&style=6 ',
};

// 默认显示天地图
const defaultProvider = new Cesium.WebMapTileServiceImageryProvider({
  // url: TDTURL_CONFIG.TDT_VEC_C, //矢量地图
  url: TDTURL_CONFIG.TDT_IMG_C,
  layer: 'tdtImg_c',
  style: 'default',
  format: 'tiles',
  tileMatrixSetID: 'c',
  subdomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
  tilingScheme: new Cesium.GeographicTilingScheme(),
  tileMatrixLabels: [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
    '12',
    '13',
    '14',
    '15',
    '16',
    '17',
    '18',
    '19',
  ],
  maximumLevel: 18,
});

// 在选择栏中显示天地图的配置
const TDT_IMG_C_P = new Cesium.ProviderViewModel({
  name: '天地图影像',
  tooltip: '天地图影像',
  iconUrl:
    'https://luojianet-frontend.obs.cn-central-221.ovaijisuan.com/staticimage/tianditu.png', // Fix:cesium地图来源选择处显示的图标存储路径
  creationFunction: function () {
    let wmts = new Cesium.WebMapTileServiceImageryProvider({
      // url: TDTURL_CONFIG.TDT_VEC_C, // 矢量地图
      url: TDTURL_CONFIG.TDT_IMG_C,
      layer: 'tdtImg_c',
      style: 'default',
      format: 'tiles',
      tileMatrixSetID: 'c',
      subdomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
      tilingScheme: new Cesium.GeographicTilingScheme(),
      tileMatrixLabels: [
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '10',
        '11',
        '12',
        '13',
        '14',
        '15',
        '16',
        '17',
        '18',
      ],
      maximumLevel: 18,
    });
    let wmts2 = new Cesium.WebMapTileServiceImageryProvider({
      // url: TDTURL_CONFIG.TDT_VEC_C, //矢量地图
      url: TDTURL_CONFIG.TDT_CIA_C,
      layer: 'tdtImg_c',
      style: 'default',
      format: 'tiles',
      tileMatrixSetID: 'c',
      subdomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
      tilingScheme: new Cesium.GeographicTilingScheme(),
      tileMatrixLabels: [
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '10',
        '11',
        '12',
        '13',
        '14',
        '15',
        '16',
        '17',
        '18',
      ],
      maximumLevel: 18,
    });
    return [wmts, wmts2];
  },
});

// 在选择栏中显示高德地图的配置
// tileMatrixLabels: ['0',...,'19']
const AMAP_IMG_P = new Cesium.ProviderViewModel({
  name: '高德影像',
  tooltip: '高德影像',
  iconUrl:
    'https://luojianet-frontend.obs.cn-central-221.ovaijisuan.com/staticimage/amap.png',
  creationFunction: function () {
    let wmts = new Cesium.WebMapTileServiceImageryProvider({
      url: AMAPURL_CONFIG.AMAP_IMG,
      layer: 'ampImg',
      style: 'default',
      format: 'tiles',
      tileMatrixSetID: 'c',
      subdomains: ['01', '02', '03', '04'],
      tilingScheme: new Cesium.WebMercatorTilingScheme(),
      // tileMatrixLabels: [],
      maximumLevel: 18,
    });
    let wmts2 = new Cesium.WebMapTileServiceImageryProvider({
      url: AMAPURL_CONFIG.AMAP_IMG_CIA,
      layer: 'ampImg',
      style: 'default',
      format: 'tiles',
      tileMatrixSetID: 'c',
      subdomains: ['01', '02', '03', '04'],
      tilingScheme: new Cesium.WebMercatorTilingScheme(),
      // tileMatrixLabels: [],
      maximumLevel: 18,
    });
    return [wmts, wmts2];
  },
});

// 在选择栏中显示Vitual Earth的配置
const BING_IMG_P = new Cesium.ProviderViewModel({
  name: 'Virtual Earth影像',
  tooltip: 'Virtual Earth影像',
  iconUrl:
    'https://luojianet-frontend.obs.cn-central-221.ovaijisuan.com/staticimage/bing.png',
  creationFunction: function () {
    let wmts = new Cesium.BingMapsImageryProvider({
      url: publicUrl.virtualEarth,
      key: 'Al39BHMrIUKkzRBWXLk09Hqd2fsIXhVlyEvYKu2QhOg41oK2kE0rigtShwIAWw1o',
      mapStyle: Cesium.BingMapsStyle.AERIAL,
    });
    return wmts;
  },
});

/**
 * Cesium显示类
 * 定义展示的控件以及功能
 */
export default class ExampleCesium {
  container;
  viewer;
  drawer;
  imglay;

  constructor(container) {
    this.container = container;

    this.viewer = new Cesium.Viewer(this.container, {
      selectionIndicator: false,
      animation: false, // 是否显示动画控件
      baseLayerPicker: true, // 是否显示图层选择控件
      imageryProviderViewModels: [AMAP_IMG_P, TDT_IMG_C_P, BING_IMG_P], // 可供BaseLayerPicker选择的图像图层ProviderViewModel数组
      geocoder: true, // 是否显示地名查找控件
      timeline: false, // 是否显示时间线控件
      sceneModePicker: true, // 是否显示投影方式控件
      navigationHelpButton: false, // 是否显示帮助信息控件
      infoBox: true, // 是否显示点击要素之后显示的信息
      fullscreenButton: true,
      // 天地图影像服务（经纬度）
      // imageryProvider: defaultProvider,//默认影像提供源
    });

    this.drawer = new DrawRect(this.viewer);
  }

  // 获取搜索的图像
  setImagery(name) {
    const models =
      this.viewer.baseLayerPicker.viewModel.imageryProviderViewModels;
    const filter = (ele) => {
      return ele.name == name;
    };
    const ans = models.filter(filter);
    if (ans.length > 0) {
      this.viewer.baseLayerPicker.viewModel.selectedImagery = ans[0];
    } else {
      this.viewer.baseLayerPicker.viewModel.selectedImagery = models[0];
    }
  }

  // 开始绘制矩形框
  startDrawRect() {
    if (typeof this.imglay != 'undefined') {
      this.viewer.scene.imageryLayers.remove(this.imglay);
      this.viewer.entities.remove(this.drawer.ansShape);
    }
    this.showInfo(false);
    this.drawer.setRectHandler();
  }

  // 结束绘制
  stopDrawRect() {
    this.drawer.removeRectHandler();
    this.showInfo(true);
  }

  // 控制是否展示信息框
  showInfo(bool) {
    const infoBoxContainer =
      document.getElementsByClassName('cesium-infoBox')[0];

    infoBoxContainer.style.display = bool ? 'block' : 'none';
  }

  // 控制是否展示细节信息框
  showInfoDetails(bool) {
    const infoBoxContainer =
      document.getElementsByClassName('cesium-infoBox')[0];

    infoBoxContainer.className = bool
      ? 'cesium-infoBox cesium-infoBox-bodyless cesium-infoBox-visible'
      : 'cesium-infoBox cesium-infoBox-bodyless';

    const infoBoxTitle = document.getElementsByClassName(
      'cesium-infoBox-title'
    )[0];

    infoBoxTitle.innerHTML = 'rect';

    infoBoxContainer.style.display = bool ? 'block' : 'none';
  }

  // 在矩形框内展示图片
  setImage(image) {
    this.drawer.setImage(image);
  }

  // 在对应位置绘制图像(图像将紧贴三维地球)
  setImageAsLayerWithCoor(image, coor, outline, fill) {
    const layers = this.viewer.scene.imageryLayers;
    const viewer = this.viewer;
    const temprect = Cesium.Rectangle.fromDegrees(
      coor[0],
      coor[1],
      coor[2],
      coor[3]
    );

    let imglay = layers.addImageryProvider(
      new Cesium.SingleTileImageryProvider({
        url: image.src,
        rectangle: temprect,
      })
    );

    if (outline || fill) {
      const outlineShape = viewer.entities.add({
        id: guid(),
        name: 'outline-rect',
        rectangle: {
          coordinates: temprect,
          fill: fill,
          material: Cesium.Color.RED.withAlpha(0.5),
          outlineColor: Cesium.Color.RED,
          height: 2,
          outline: true,
        },
      });
    }

    this.imglay = imglay;

    imglay.splitDirection = Cesium.SplitDirection.LEFT;

    // Sync the position of the slider with the split position
    var slider = document.getElementById('slider');
    slider.style.display = 'block';

    this.viewer.scene.splitPosition =
      (slider.offsetLeft - 0) / slider.parentElement.offsetWidth;

    try {
      var handler = new Cesium.ScreenSpaceEventHandler(slider);
    } catch (error) {
      return error;
    }

    // TODO：改下单位，现在屏幕变了就对不上了
    this.viewer.flyTo(imglay, {
      duration: 2.0,
      offset: new Cesium.HeadingPitchRange(0, -2, 200),
    });
    slider.style.left = slider.parentElement.offsetWidth / 2 + 0 + 'px';
    this.viewer.scene.splitPosition = 0.5;
    var moveActive = false;

    function move(movement) {
      if (!moveActive) {
        return;
      }

      var relativeOffset = movement.endPosition.x;

      var splitPosition =
        (slider.offsetLeft - 0 + relativeOffset) /
        slider.parentElement.offsetWidth;
      slider.style.left =
        slider.parentElement.offsetWidth * splitPosition + 0 + 'px';

      viewer.scene.splitPosition = splitPosition;
    }

    // 鼠标左键按下
    handler.setInputAction(function () {
      moveActive = true;
    }, Cesium.ScreenSpaceEventType.LEFT_DOWN);
    // 两个手指划屏幕
    handler.setInputAction(function () {
      moveActive = true;
    }, Cesium.ScreenSpaceEventType.PINCH_START);
    // 鼠标移动
    handler.setInputAction(move, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    // 手指移动
    handler.setInputAction(move, Cesium.ScreenSpaceEventType.PINCH_MOVE);
    // 鼠标左键弹起
    handler.setInputAction(function () {
      moveActive = false;
    }, Cesium.ScreenSpaceEventType.LEFT_UP);
    // 手指抬起
    handler.setInputAction(function () {
      moveActive = false;
    }, Cesium.ScreenSpaceEventType.PINCH_END);
  }

  // 在对应位置绘制图像
  setImageAsLayer(image) {
    let layers = this.viewer.scene.imageryLayers;

    let viewer = this.viewer;

    this.drawer.ansShape.rectangle.material = Cesium.Color.AZURE.withAlpha(0.1);

    let imglay = layers.addImageryProvider(
      new Cesium.SingleTileImageryProvider({
        url: image.src,
        rectangle: this.drawer.ansShape.rectangle.coordinates.getValue(0),
      })
    );

    this.imglay = imglay;

    imglay.splitDirection = Cesium.SplitDirection.LEFT;

    // Sync the position of the slider with the split position
    var slider = document.getElementById('slider');

    this.viewer.scene.splitPosition =
      (slider.offsetLeft - 0) / slider.parentElement.offsetWidth;

    try {
      var handler = new Cesium.ScreenSpaceEventHandler(slider);
    } catch (error) {
      return error;
    }

    // TODO：改下单位，现在屏幕变了就对不上了
    this.viewer.flyTo(this.drawer.ansShape, {
      duration: 2.0,
      offset: new Cesium.HeadingPitchRange(0, -2, 200),
    });

    slider.style.left = slider.parentElement.offsetWidth / 2 + 0 + 'px';
    viewer.scene.splitPosition = 0.5;
    var moveActive = false;

    function move(movement) {
      if (!moveActive) return;

      var relativeOffset = movement.endPosition.x;

      var splitPosition =
        (slider.offsetLeft - 0 + relativeOffset) /
        slider.parentElement.offsetWidth;

      slider.style.left =
        slider.parentElement.offsetWidth * splitPosition + 0 + 'px';

      viewer.scene.splitPosition = splitPosition;
    }

    // 鼠标左键按下
    handler.setInputAction(function () {
      moveActive = true;
    }, Cesium.ScreenSpaceEventType.LEFT_DOWN);
    // 双指滑动
    handler.setInputAction(function () {
      moveActive = true;
    }, Cesium.ScreenSpaceEventType.PINCH_START);
    // 鼠标移动
    handler.setInputAction(move, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    // 手指移动
    handler.setInputAction(move, Cesium.ScreenSpaceEventType.PINCH_MOVE);
    // 鼠标左键弹起
    handler.setInputAction(function () {
      moveActive = false;
    }, Cesium.ScreenSpaceEventType.LEFT_UP);
    // 手指抬起
    handler.setInputAction(function () {
      moveActive = false;
    }, Cesium.ScreenSpaceEventType.PINCH_END);
  }

  // 移除前面展示的图片
  removeImageLayers() {
    for (let i = 0; i <= this.viewer.scene.imageryLayers.length; i++) {
      let templay = this.viewer.scene.imageryLayers.get(i);
      if (
        templay?.imageryProvider instanceof Cesium.SingleTileImageryProvider
      ) {
        this.viewer.scene.imageryLayers.remove(templay);
      }
    }
  }

  // 移除前面绘制的紧贴地球表面的图形
  removeEntities() {
    this.viewer.entities.removeAll();
  }
}
