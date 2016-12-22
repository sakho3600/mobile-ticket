export class GpsPositionCalculator {

    //ref http://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula

    public getDistanceFromLatLon(lat1, lon1, lat2, lon2) {
        let R = 6371; // Radius of the earth in km
        let dLat = this.deg2rad(lat2 - lat1);  // deg2rad below
        let dLon = this.deg2rad(lon2 - lon1);
        let a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
            ;
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        let d: any = R * c; // Distance in km

        if (d <= 1) {
            d = Math.round(d * 1000)+"m";
        } else {
            d = Math.round(d)+"km";
        }

        return d;
    }

    private deg2rad(deg) {
        return deg * (Math.PI / 180)
    }
}