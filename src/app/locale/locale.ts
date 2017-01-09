import { Inject, Injectable } from '@angular/core';
import { TranslateService, LangChangeEvent } from 'ng2-translate';

@Injectable()
export class Locale {
    constructor(private translate: TranslateService) {
        
    }

    setLocale(){
        this.translate.setDefaultLang('en');
        let browserLang = this.translate.getBrowserLang();
        this.translate.use(browserLang);

        this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
            var availableLangs = this.translate.getLangs();
            var rtlLang = ["ar", "arc", "dv", "far", "ha", "he", "khw", "ks", "ku", "ps", "ur", "yi"];
            if(rtlLang.indexOf(browserLang) != -1 && availableLangs.indexOf(browserLang) != -1){
                document.dir = "rtl";
            }
        });
    }

}
