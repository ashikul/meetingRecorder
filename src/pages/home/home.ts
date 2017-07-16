import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {
    SpeechRecognition,
    SpeechRecognitionListeningOptionsAndroid,
    SpeechRecognitionListeningOptionsIOS
} from '@ionic-native/speech-recognition';
import {Platform} from 'ionic-angular';

import {AlertController} from 'ionic-angular';
import {Media, MediaObject} from '@ionic-native/media';
import {Base64} from '@ionic-native/base64';

import {Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
// import { MediaPlugin } from 'ionic-native';
// import {Observable} from'rxjs/Observable';
import {File} from '@ionic-native/file';


@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})


export class HomePage {

    speechList: Array<string> = [];
    androidOptions: SpeechRecognitionListeningOptionsAndroid;
    iosOptions: SpeechRecognitionListeningOptionsIOS;
    mediaPlugin: MediaObject = null;
    recorded: boolean;
    recording: boolean;
    file;
    fileSWA;
    posts;
    speechText;
    encodedAudio= '';
    readDATAURL;
    directory;
    directory1;
    directory2;
    path;
    pathDirectory;
    APIresponse;
    APIdata;


    constructor(public navCtrl: NavController, private platform: Platform, private speech: SpeechRecognition, private alertCtrl: AlertController,
                private media: Media, private base64: Base64, public http: Http, public fileHelper: File) {
        this.recorded = false;
        this.recording = false;
        this.file = this.media.create('recording1.flac');
        this.fileSWA = this.media.create('shwa.flac');
// this.directory = cordova.file.applicationStorageDirectory;
// this.directory1 = cordova.file.applicationDirectory;
// this.directory2 = cordova.file.dataDirector;

        //not working
        // console.log(btoa(this.fileSWA));
        // console.log(btoa('shwa.flac'));

        // console.log('CONSTRCUTOR');
        console.log(this.file);
        console.log(this.fileSWA);

        this.path = 'file:///';
        this.pathDirectory = '';

        // this.fileHelper.listDir(this.path, this.pathDirectory)
        //     .then(
        //         response => {
        //             this.directory = response;
        //             this.showAlert('listDir: ' + response);
        //         }).catch(err => this.showAlert('listDir:error ' + err));
        //
        // fileHelper.getFreeDiskSpace()
        //     .then(
        //         response => {
        //             this.showAlert('diskspace: ' + response)
        //         }).catch(err => this.showAlert('getFreeDiskSpace:error ' + err));


        //this work, but is different, and needs string split. 2nd
        // fileHelper.readAsDataURL('file:///sdcard/', 'shwa.flac')
        //     .then(
        //         response => {
        //             this.readDATAURL = response;
        //             this.showAlert('readAsDataURL: ' + response);
        //         }).catch(err =>  this.showAlert('readAsDataURL:error ' + err));



        // file:///android_asset/
        // has images, pak files, www, webkit, sounds

        //nothing in file:///, XXX cache, data, ssystem,
        // sotrage has fe6666-c8c4

        // fileHelper.listDir('file:///', 'cache')
        //     .then(
        //         response => {
        //             this.directory = response;
        //             this.showAlert('listDir: ' + response);
        //         }).catch(err =>  this.showAlert('listDir:error ' + err));

        // fileHelper.listDir('file:///', 'data')
        //     .then(
        //         response => {
        //             this.directory1 = response;
        //             this.showAlert('listDir1: ' + response);
        //         }).catch(err =>  this.showAlert('listDir1:error ' + err));


        //for 'file:///'
        //try data, root, dev, system, cache, sdcard, storage, d , etc

        // fileHelper.listDir('file:///', 'storage')
        //     .then(
        //         response => {
        //             this.directory2 = response;
        //             // this.showAlert('listDir2: ' + response);
        //         }).catch(err =>  this.showAlert('listDir2:error ' + err));
        //

        // this.showAlert('Error: ' + e);
        // this.showAlert('Error: ' + e);
        //
        // handleEncoding()

        // //this works
        // this.http.get('https://www.reddit.com/r/gifs/new/.json?limit=10').map(res => res.json()).subscribe(data => {
        //     this.posts = data.data.children;
        // });
    }

    // handleEncoding(file) {
    //
    //
    //
    //     if (file) {
    //         var reader = new FileReader();
    //
    //         reader.onload = function (readerEvt) {
    //             var binaryString = readerEvt.target.result;
    //             let g = btoa(binaryString);
    //             this.encodedAudio = g;
    //         };
    //
    //         reader.readAsBinaryString(file);
    //     }
    // };


    // get MediaPlugin(): MediaObject {
    //     if (this.mediaPlugin == null) {
    //         this.mediaPlugin = new MediaObject('recording.wav');
    //     }
    //
    //
    //     // const file: MediaObject = this.media.create('path/to/file.mp3');
    //
    //     return this.mediaPlugin;
    // }

    //TODO: add this
    // encodeFile() {
    //
    //     let filePath: string = 'file:///...';
    //     this.base64.encodeFile(filePath).then((base64File: string) => {
    //         console.log(base64File);
    //     }, (err) => {
    //         console.log(err);
    //     });
    // }


    listDir() {
        this.fileHelper.listDir(this.path, this.pathDirectory)
            .then(
                response => {
                    this.directory = response;
                    this.showAlert('listDir: ' + response);
                }).catch(err => this.showAlert('listDir:error ' + err));

    }

    //TODO: disable certain buttons
    //TODO: where do I put release??

    googleAPI(debug) {

        let url = '';

        if (debug) {
            url = 'file:///sdcard/shwa.flac';
        } else {
            url = 'file:///sdcard/recording1.flac';
        }

        this.base64.encodeFile(url).then((base64File: string) => {
            console.log(base64File);

            this.encodedAudio = base64File.split(",")[1];
            this.showAlert('encoding---: ' + this.encodedAudio + ' --- ' + base64File.split(",")[0] );
            if (this.encodedAudio){
                let headers = new Headers(
                    {
                        'Content-Type': 'application/json'
                    });
                let options = new RequestOptions({headers: headers});

                let data = JSON.stringify({
                    "config": {
                        "encoding": "FLAC",
                        "sampleRateHertz": 16000,
                        "languageCode": "en-US"
                    },
                    "audio": {
                        "content": this.encodedAudio
                    }
                });

                this.APIdata = data;

                this.http.post('https://speech.googleapis.com/v1/speech:recognize?key=AIzaSyAgYh1VIHlcV6CdI5acPtliWVNclTr14Xc', data, options)
                    .map(res => res.json()).subscribe(data => {

                    console.log('YOOOOOOO');
                    this.showAlert('Google Speech API Response: ' + data);

                    this.APIresponse = data;

                    if (data.results) {
                        //TODO: check for normal response

                        if (data.results[0].alternatives) {
                            if (data.results[0].alternatives[0].transcript) {
                                this.speechText = data.results[0].alternatives[0].transcript;
                            }
                        }

                    } else {
                        this.speechText = 'NOTHING RECOGNIZED';
                    }

                    console.log(data);
                    // this.posts = data.data.children;
                });



            }


        }, (err) => {
            this.showAlert('Base64 Error: ' + err);
            console.log(err);
        });

    }


    startRecording() {
        try {
            // this.MediaPlugin.startRecord();
            this.file.startRecord();
            this.recording = true;
        }
        catch (e) {
            this.showAlert('Error: ' + e);
        }
    }

    stopRecording() {
        try {
            // this.MediaPlugin.stopRecord();
            this.file.stopRecord();
            this.recorded = true;
            this.recording = false;
        }
        catch (e) {
            this.showAlert('Error: ' + e);
        }
    }

    playRecording() {
        try {
            this.file.play();
        }
        catch (e) {
            this.showAlert('Error: ' + e);
        }
    }

    playRecordingSWA() {
        try {
            this.fileSWA.play();
        }
        catch (e) {
            this.showAlert('Error: ' + e);
        }
    }

    stopRecordingPlay() {
        try {
            this.file.stop();
        }
        catch (e) {
            this.showAlert('Error: ' + e);
        }
    }

    showAlert(message) {
        let alert = this.alertCtrl.create({
            title: 'Alert',
            subTitle: message,
            buttons: ['OK']
        });
        alert.present();
    }

    //----------------------------------------------------------------------------
    //----------------------------------------------------------------------------
    //----------------------------------------------------------------------------
    //----------------------------------------------------------------------------
    //----------------------------------------------------------------------------
    //----------------------------------------------------------------------------
    //----------------------------------------------------------------------------
    //----------------------------------------------------------------------------
    //----------------------------------------------------------------------------
    //----------------------------------------------------------------------------
    //----------------------------------------------------------------------------
    //----------------------------------------------------------------------------

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
