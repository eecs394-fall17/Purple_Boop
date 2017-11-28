
import { Component, ViewChild } from '@angular/core';
import { Nav, NavController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabaseModule, AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import { SelectTexturePage } from '../select-texture/select-texture';
import { DiagnosisPage } from '../diagnosis/diagnosis';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Crop } from '@ionic-native/crop';
import { storage, initializeApp } from 'firebase';
import { environment } from '../../environments/environment';
import { ToastController } from 'ionic-angular';


import * as _ from 'lodash';
import * as sightengine from 'sightengine';


@Component({
	selector: 'page-select-color',
	templateUrl: 'select-color.html'
})
export class SelectColorPage {
	// @ViewChild(Nav) navi: Nav;
	// colors: Array<{hex:string, name:string}>;
	colors: Array<any>;
	selectedColor: string = "";

	// borderColors = {}; //Note the key has no # but the result does.
	// fontColors = {}; //Note the key has no # but the result does.
	colsPerRow:number = 3;
	colorGridRows: Array<any>; //Each element will be a list of colors corresponidng to a row.

	public base64Image: string;
	//testImage: string = 'https://www.scienceabc.com/wp-content/uploads/2017/02/Thailand-beach-sand.jpg';
	fireURL: string;
	dominantColor: string;

	private captureOptions: CameraOptions = {
		allowEdit:true,
		quality: 50,
		destinationType: this.camera.DestinationType.DATA_URL,
		encodingType: this.camera.EncodingType.JPEG,
		mediaType: this.camera.MediaType.PICTURE,
	}

	private uploadOptions: CameraOptions = {
		allowEdit:true,
		quality: 50,
		destinationType: this.camera.DestinationType.DATA_URL,
		encodingType: this.camera.EncodingType.JPEG,
		mediaType: this.camera.MediaType.PICTURE,
		sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
	}


	constructor(public navCtrl: NavController, public db: AngularFireDatabase, private camera: Camera, private toastCtrl: ToastController) {
		db.list<any>('/Colors').valueChanges().subscribe(_rawcolors => {
			this.colors = _.sortBy(_rawcolors, "no");
			//console.log("this.colors is: ", this.colors);
			this.setColorGridSets();
		});
		
		initializeApp(environment.firebase);
	}

	moveToNextPage(color, img=null){
		if(color.hex==="#f6f6f6"){
			this.navCtrl.push(DiagnosisPage, { selectedColor: color, image: img, 
				text :"Ghostly looking is no joking matter. If your baby isn't producing bile (which gives stool its characterestic color), it will look colorless, white or chalky. This can be a sign of serious liver or gallbladder problem.",
				severity:"Red"
			});	
			// selectedColor: this.selectedColor, image: this.imageSRC, response: this.diagnosisJson
		}
		else{
			this.navCtrl.push(SelectTexturePage, { selectedColor: color, image: img});	
		}
	}

	onClick(color) {
		console.log("onClick color: ", color);
		this.moveToNextPage(color);
	}

	analyze() {
		let color;
		let url = this.fireURL;
		//let url = this.testImage;
		sightengine("1801151869", "bBS92aZfoXDJKm9Y3p8u").check(['properties']).set_url(url).then(function (result) {
			//this will return a string of the dominant hex value
			if (result.status == "success") {
				color = result.colors.dominant.hex;
				return color;
			}

		}).then((work) => {
			this.dominantColor = work;
			this.selectedColor = this.getNearestColor(work);
			return this.selectedColor;
		}).then((color)=>{
			//console.log(this.testImage);
			this.moveToNextPage(color, this.fireURL);
		}).catch(function (err) {
			console.log(err);
		});
	}

	takePicture() {
		this.camera.getPicture(this.captureOptions).then((imageData) => {
			this.base64Image = "data:image/jpeg;base64," + imageData;
			this.upload();
		}, (err) => {
			console.log(err);
		})
	}

	uploadPicture(){
		this.camera.getPicture(this.uploadOptions).then((imageData) => {
			this.base64Image = "data:image/jpeg;base64," + imageData;
			this.upload();
		}, (err) => {
			console.log(err);
		})
	}

	upload() {
		this.analyzeToast();
		const rootRef = storage().ref();
		const filename = Math.floor(Date.now() / 1000);
		let imageRef = rootRef.child(`images/${filename}.jpg`)

		imageRef.putString(this.base64Image, 'data_url').then(snapshot => {
			this.fireURL = snapshot.downloadURL;
			this.analyze();
		})

	}

	onClickCamera() {
		this.flashToast();
	}

	onClickUpload() {
		this.uploadPicture();
	}

	

	getNearestColor(inp_color) {
		let nearestColor, i, _dist;
		let smallestDistance = Infinity;
		for (i = 0; i < this.colors.length; i++) {
			_dist = this.calcDistance(this.colors[i].hex, inp_color);
			if (_dist < smallestDistance) {
				nearestColor = this.colors[i];
				smallestDistance = _dist;
			}
		}
		return nearestColor;
	}

	calcDistance(color1, color2) {
		let _col1 = this.hex2RGB(color1), _col2 = this.hex2RGB(color2);
		let _ans = _.sum(_.map(_.zip(_col1, _col2), p => (p[1] - p[0]) ** 2)) ** 1 / 2;
		return _ans;
	}

	hex2RGB(c) {
		if (c[0] == "#") {
			c = c.substring(1);
		}
		let temp = ([c.substring(0, 2), c.substring(2, 4), c.substring(4, 6)]);
		return _.map(temp, t => parseInt(t, 16));
	}

	setColorGridSets(){
		this.colorGridRows = _.chunk(this.colors, this.colsPerRow);
		console.log("colorGridRows is: ", this.colorGridRows);
	}

	flashToast() {
		let toast = this.toastCtrl.create({
			message: 'Please turn on flash for best the results',
			position: 'top',
			showCloseButton: true,
			closeButtonText: "OK",
		});

		toast.present();

		toast.onDidDismiss(() => {
			if (this.navCtrl.getActive().component.name == "SelectColorPage") {
				this.takePicture();
			};
		});
	}

	analyzeToast() {
		let toast = this.toastCtrl.create({
			message: 'Analyzing your image...Please wait',
			duration: 3000,
			position: 'top'
		});

		toast.present();
	}

	failToast() {
		let toast = this.toastCtrl.create({
			message: 'Uh oh, something went wrong. Please try again.',
			duration: 3000,
			position: 'top'
		});

		toast.present();
	}
}