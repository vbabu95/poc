import AppModule from './app';
import config from '../config/app.config';
import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

if (config.environment === 'production') {
    enableProdMode();
}

if (typeof(jasmine) === 'undefined') {
    platformBrowserDynamic().bootstrapModule(AppModule);
}
//TODO: this is your main entry point for the client app

//import our icons at least once in app to use them
import './icons/font';
