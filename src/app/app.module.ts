import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';
import  {SpeechRecognition} from '@ionic-native/speech-recognition';

import {MyApp} from './app.component';
import {HomePage} from '../pages/home/home';
import { Media } from '@ionic-native/media';
import { Base64 } from '@ionic-native/base64';
import { File } from '@ionic-native/file';
import { HttpModule} from '@angular/http';
@NgModule({
    declarations: [
        MyApp,
        HomePage
    ],
    imports: [
        BrowserModule,
        IonicModule.forRoot(MyApp),
        HttpModule
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        HomePage
    ],
    providers: [
        StatusBar,
        SplashScreen,
        SpeechRecognition,
        Media,
        Base64,
        File,
        {provide: ErrorHandler, useClass: IonicErrorHandler}

    ]
})
export class AppModule {
}
