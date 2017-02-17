declare var ga: Function;

export class Util {

    private IMPERIAL_UNIT_COUNTRY_CODES = ["US", "LR", "MM"];

    public getNumberSufix(number: number) {
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
        for (let code of this.IMPERIAL_UNIT_COUNTRY_CODES) {
            let localeCodeElements = lang.split('-');
            if ((localeCodeElements.length === 2 && localeCodeElements[1].toLowerCase()) === code.toLowerCase()) {
                return true;
            } else {
                return false;
            }
        }
    }

    public getStatusErrorCode(val: string) {
        var regex = (/error_code:\s*(\d*)/g);
        var parsedArray = regex.exec(val);
        if (parsedArray && parsedArray.length > 0) {
            return parsedArray[1];
        }
    }

    public gaSend() {
        ga('send', {
            hitType: 'event',
            eventCategory: 'Ticket',
            eventAction: 'create',
            eventLabel: 'vist-create'
        });
    }

    public getClientId(): any {
        let clientId;
        ga(function (tracker) {
            if (tracker.get('clientId')) {
                clientId = tracker.get('clientId');
            }
            else {
                clientId = '';
            }
        });
        return clientId;
    }

}