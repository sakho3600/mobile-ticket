export class PositionEntity {
    public latitude: number
    public longitude: number
    constructor(lat: number, lon: number) {
        this.latitude = lat;
        this.longitude = lon;
    }
}