import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {
    SpeechRecognition,
    SpeechRecognitionListeningOptionsAndroid,
    SpeechRecognitionListeningOptionsIOS
} from '@ionic-native/speech-recognition';
import {Platform} from 'ionic-angular';

import {AlertController} from 'ionic-angular';
// import {Observable} from'rxjs/Observable';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {


    speechList: Array<string> = [];
    androidOptions: SpeechRecognitionListeningOptionsAndroid;
    iosOptions: SpeechRecognitionListeningOptionsIOS;

    constructor(public navCtrl: NavController, private platform: Platform, private speech: SpeechRecognition, private alertCtrl: AlertController) {

    }


    async isSpeechSupported(): Promise<boolean> {
        let isAvailable = await this.speech.isRecognitionAvailable();
        console.log(isAvailable);


        let alert = this.alertCtrl.create({
            title: 'Output',
            message: "" + isAvailable
        });
        alert.present();

        return isAvailable;
    }

    async getPermission(): Promise<void> {
        try {
            let permission = await this.speech.requestPermission();
            console.log(permission);

            let alert = this.alertCtrl.create({
                title: 'Output',
                message: "" + permission
            });
            alert.present();

            return permission;
        }
        catch (e) {
            console.error(e);
        }
    }

    async hasPermission(): Promise<boolean> {
        try {
            let permission = await this.speech.hasPermission();
            console.log(permission);

            let alert = this.alertCtrl.create({
                title: 'Output',
                message: "" + permission
            });
            alert.present();

            return permission;
        }
        catch (e) {
            console.error(e);
        }
    }

    async getSupportedLanguages(): Promise<Array<string>> {
        try {
            let languages = await this.speech.getSupportedLanguages();
            console.log(languages);

            let alert = this.alertCtrl.create({
                title: 'Output',
                message: "" + languages
            });
            alert.present();

            return languages;
        }
        catch (e) {
            console.error(e);
        }
    }

    listenForSpeech(): void {

        this.androidOptions = {
            prompt: 'Speak into your phone!'
        }

        this.iosOptions = {
            language: 'en-US'
        }

        if (this.platform.is('android')) {
            this.speech.startListening(this.androidOptions).subscribe(data => this.speechList = data, error => console.log(error));
        }
        else if (this.platform.is('ios')) {
            this.speech.startListening(this.iosOptions).subscribe(data => this.speechList = data, error => console.log(error));
        }
    }
}
