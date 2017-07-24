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

    public isBrowseriOS(userAgentString) {
        let browser = this.getDetectBrowser(userAgentString);
        if (browser.name === 'safari' || browser.name === 'ios') {
            return true;
        }
        return false;
    }

    public getDetectBrowser(userAgentString): any {
        if (!userAgentString) return null;

        var browsers = [
            ['edge', /Edge\/([0-9\._]+)/],
            ['yandexbrowser', /YaBrowser\/([0-9\._]+)/],
            ['chrome', /(?!Chrom.*OPR)Chrom(?:e|ium)\/([0-9\.]+)(:?\s|$)/],
            ['crios', /CriOS\/([0-9\.]+)(:?\s|$)/],
            ['firefox', /Firefox\/([0-9\.]+)(?:\s|$)/],
            ['opera', /Opera\/([0-9\.]+)(?:\s|$)/],
            ['opera', /OPR\/([0-9\.]+)(:?\s|$)$/],
            ['ie', /Trident\/7\.0.*rv\:([0-9\.]+)\).*Gecko$/],
            ['ie', /MSIE\s([0-9\.]+);.*Trident\/[4-7].0/],
            ['ie', /MSIE\s(7\.0)/],
            ['bb10', /BB10;\sTouch.*Version\/([0-9\.]+)/],
            ['android', /Android\s([0-9\.]+)/],
            ['ios', /Version\/([0-9\._]+).*Mobile.*Safari.*/],
            ['safari', /Version\/([0-9\._]+).*Safari/]
        ];

        return browsers.map(function (rule) {
            if (new RegExp(rule[1]).exec(userAgentString)) {
                var match = new RegExp(rule[1]).exec(userAgentString);
                var version = match && match[1].split(/[._]/).slice(0, 3);

                if (version && version.length < 3) {
                    Array.prototype.push.apply(version, (version.length == 1) ? [0, 0] : [0]);
                }

                return {
                    name: rule[0],
                    version: version.join('.')
                };
            }
        }).filter(Boolean).shift();
    }

    public isValidUrl(url): boolean {
        return /^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,})$/i.test(url);
    }

    public sortArrayCaseInsensitive(array, property, sortOrder) {
        // Default Sort is Asc
        array.sort(function (a, b) {
            var ax = [], bx = [];

            var a = a[property].toString();
            var b = b[property].toString();

            a.replace(/(\d+)|(\D+)/g, function (_, $1, $2) { ax.push([$1 || Infinity, $2 || ""]) });
            b.replace(/(\d+)|(\D+)/g, function (_, $1, $2) { bx.push([$1 || Infinity, $2 || ""]) });

            while (ax.length && bx.length) {
                var an = ax.shift();
                var bn = bx.shift();
                var nn = (an[0] - bn[0]) || an[1].localeCompare(bn[1]);
                if (nn) return nn;
            }

            return ax.length - bx.length;
        });
        if (sortOrder == "desc")
            array.reverse();
    }

}