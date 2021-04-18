import SnapMixin from '../Mixins/Snapping';
import DragMixin from '../Mixins/Dragging';
import RotateMixin from "../Mixins/Rotating";

const Edit = L.Class.extend({
  includes: [DragMixin, SnapMixin, RotateMixin],
  options: {
    snappable: true,
    snapDistance: 20,
    allowSelfIntersection: true,
    allowSelfIntersectionEdit: false,
    preventMarkerRemoval: false,
    removeLayerBelowMinVertexCount: true,
    limitMarkersToCount: -1,
    hideMiddleMarkers: false,
    draggable: true,
    snapSegment: true,
    addVertexOn: 'click',
    removeVertexOn: 'contextmenu',
    removeVertexValidation: undefined,
    addVertexValidation: undefined,
    moveVertexValidation: undefined,
  },
  setOptions(options) {
    L.Util.setOptions(this, options);
  },
  applyOptions() { },
  isPolygon() {
    // if it's a polygon, it means the coordinates array is multi dimensional
    return this._layer instanceof L.Polygon;
  },
  getShape(){
    return this._shape;
  },
  _setPane(layer,type){
    if(type === "layerPane"){
      layer.options.pane = this._map.pm.globalOptions.panes && this._map.pm.globalOptions.panes.layerPane || 'overlayPane';
    }else if(type === "vertexPane"){
      layer.options.pane = this._map.pm.globalOptions.panes && this._map.pm.globalOptions.panes.vertexPane || 'markerPane';
    }else if(type === "markerPane"){
      layer.options.pane = this._map.pm.globalOptions.panes && this._map.pm.globalOptions.panes.markerPane || 'markerPane';
    }
  },
  _vertexValidation(type, e){
    const marker = e.target;
    const args = {layer: this._layer, marker, event: e };

    let validationFnc = "";
    if(type === 'move') {
      validationFnc = "moveVertexValidation";
    } else if(type === 'add') {
      validationFnc = "addVertexValidation";
    } else if(type === 'remove') {
      validationFnc = "removeVertexValidation";
    }

    // if validation goes wrong, we return false
    if (this.options[validationFnc] && typeof this.options[validationFnc] === "function" && !this.options[validationFnc](args)) {
      if(type === 'move') {
        marker._vertexResetLatLng = marker.getLatLng();
      }
      return false;
    }

    marker._vertexResetLatLng = null;
    return true;
  },
  _vertexValidationDrag(marker){
    // we reset the marker to the place before it was dragged. We need this, because we can't stop the drag process in a `dragstart` | `movestart` listener
    if(marker._vertexResetLatLng){
      marker._latlng = marker._vertexResetLatLng;
      marker.update();
      return false;
    }
    return true;
  },
  _vertexValidationDragEnd(marker){
    if(marker._vertexResetLatLng){
      marker._vertexResetLatLng = null;
      return false;
    }
    return true;
  }

});

export default Edit;
