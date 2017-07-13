import '/src/app/polyfills.ts';

import { enableProdMode } from '@angular/core';
import { platformBrowser }    from '@angular/platform-browser';
import { AppModuleNgFactory } from './../aot/src/app/module.ngfactory';



enableProdMode();
console.log('Running AOT compiled, production mode active');
platformBrowser().bootstrapModuleFactory(AppModuleNgFactory);