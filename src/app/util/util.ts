export class Util {

    private IMPERIAL_UNIT_COUNTRY_CODES = ["US","LR","MM"];

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

    public isImperial(): boolean {
        let lang: string = navigator.language;
        for(let code of this.IMPERIAL_UNIT_COUNTRY_CODES) {
            if(code.toLowerCase() === lang.split('-')[1].toLowerCase()) {
                return true;
            }
        }
    }

}