import * as Cesium from 'cesium';

/**
 * 生成标识码
 * @returns {string}
 */
export function guid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * 矩形绘制工具类
 */
export class DrawRect {
  handler;
  viewer;
  ansShape;
  constructor(viewer) {
    this.viewer = viewer;
    viewer.scene.globe.depthTestAgainstTerrain = true;
  }

  // 设置鼠标控制事件
  setRectHandler = () => {
    let viewer = this.viewer;
    let activeShapePoints = [];
    let activeShape;
    let floatingPoint;
    let pointID = 'pid0';
    let rectID = 'rectid0';
    let previousPoints = [];
    let setAnsShape = this.setAnsShape;

    this.handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
    let handler = this.handler;

    //双击鼠标左键清除默认事件
    viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
      Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
    );
    //绘制点
    function createPoint(worldPosition) {
      let point = viewer.entities.add({
        position: worldPosition,
        point: {
          color: Cesium.Color.WHITE,
          pixelSize: 0,
          //disableDepthTestDistance:Number.POSITIVE_INFINITY,
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
          scaleByDistance: new Cesium.NearFarScalar(1.5e2, 2.0, 1.5e7, 0.5),
        },
        zIndex: 20,
      });
      return point;
    }

    //绘制图形
    function drawShape(positionData) {
      let shape;
      //当positionData为数组时绘制最终图，如果为function则绘制动态图
      let arr =
        typeof positionData.getValue === 'function'
          ? positionData.getValue(0)
          : positionData;
      shape = viewer.entities.add({
        id: rectID,
        name: 'rect',
        rectangle: {
          coordinates: new Cesium.CallbackProperty(function () {
            //通过当前点创建矩形框
            let obj = Cesium.Rectangle.fromCartesianArray(arr);
            //防止矩形框缩为点
            if (obj.west == obj.east) {
              obj.east += 0.000001;
            }
            if (obj.south == obj.north) {
              obj.north += 0.000001;
            }
            return obj;
          }, false),
          material: Cesium.Color.RED.withAlpha(0.5),
          zIndex: 1,
        },
      });
      return shape;
    }

    // Redraw the shape so it's not dynamic and remove the dynamic shape.
    // 当形状确定后删除前面的动态图并绘制最终的图形
    function terminateShape() {
      rectID = 'rectid0';
      activeShapePoints.pop(); //去除最后一个动态点
      if (activeShapePoints.length) {
        setAnsShape(drawShape(activeShapePoints));
        //绘制最终图
      }
      viewer.entities.remove(floatingPoint); //去除动态点图形（当前鼠标点）
      viewer.entities.remove(activeShape); //去除动态图形
      floatingPoint = undefined;
      activeShape = undefined;
      activeShapePoints = [];
    }

    //鼠标左键
    handler.setInputAction(function (event) {
      //将光标形状设置为十字
      viewer.container.style.cursor = 'crosshair';
      // We use `viewer.scene.pickPosition` here instead of `viewer.camera.pickEllipsoid` so that
      // we get the correct point when mousing over terrain.
      // 使用pickPosition可以获得正确的点位置信息
      let earthPosition = viewer.scene.pickPosition(event.position);
      // `earthPosition` will be undefined if our mouse is not over the globe.
      // 如果鼠标事件没有被触发过，earthPosition为undefined
      if (Cesium.defined(earthPosition)) {
        if (activeShapePoints.length === 0) {
          // delete previous rect&points
          rectID = 'rectid0';
          viewer.entities.removeById(rectID);
          viewer.entities.removeAll();

          rectID = guid();
          floatingPoint = createPoint(earthPosition);
          previousPoints.push(floatingPoint);
          activeShapePoints.push(earthPosition);
          let dynamicPositions = new Cesium.CallbackProperty(function () {
            return activeShapePoints;
          }, false);
          activeShape = drawShape(dynamicPositions); //绘制动态图
        }
        activeShapePoints.push(earthPosition);
        previousPoints.push(createPoint(earthPosition));
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    //鼠标移动
    handler.setInputAction(function (event) {
      rectID = guid();
      if (Cesium.defined(floatingPoint)) {
        let newPosition = viewer.scene.pickPosition(event.endPosition);
        if (Cesium.defined(newPosition)) {
          floatingPoint.position.setValue(newPosition);
          activeShapePoints.pop();
          activeShapePoints.push(newPosition);
        }
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    //鼠标右键
    handler.setInputAction(function (event) {
      viewer.container.style.cursor = 'auto';
      terminateShape();
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
  };

  //移除鼠标控制事件
  removeRectHandler = () => {
    this.handler.destroy();
  };

  //保存最终图
  setAnsShape = (shape) => {
    this.ansShape = shape;
  };

  //获取最终图
  getAnsShape = () => {
    return this.ansShape;
  };

  //获取矩形框坐标
  getAnsShapeRectCoor = () => {
    const coorRad = this.ansShape.rectangle.coordinates.getValue(0);

    const coorAngle = {
      east: (coorRad.east / Math.PI) * 180,
      west: (coorRad.west / Math.PI) * 180,
      south: (coorRad.south / Math.PI) * 180,
      north: (coorRad.north / Math.PI) * 180,
    };

    return coorAngle;
  };

  //设置矩形框中的图像
  setImage = (image) => {
    this.ansShape.rectangle.material = image.src;
  };
}
