
var watchId;
var broadcastPosition;
var broadcastError;

export class LocationService {

    watchCurrentPosition(successCallback, errorCallbcak){
        broadcastPosition = successCallback;
        broadcastError = errorCallbcak;
        watchId = navigator.geolocation.watchPosition(this.setPosition, this.handleError);
    }

    removeWatcher(){
        navigator.geolocation.clearWatch(watchId);
    }

    setPosition(position){
        broadcastPosition(position);
    }

    handleError(error){
        broadcastError(error);
    }
}