export class Util {

    public getNumberSufix(number : number) {
        var m = number % 10,
        n = number % 100;
        if (m == 1 && n != 11) {
            return number + "st";
        }
        if (m == 2 && n != 12) {
            return number + "nd";
        }
        if (m == 3 && n != 13) {
            return number + "rd";
        }
        return number + "th";
    }
}