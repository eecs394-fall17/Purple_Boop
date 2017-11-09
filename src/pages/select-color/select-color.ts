
import { Component, ViewChild } from '@angular/core';
import { Nav, NavController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabaseModule, AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import { SelectTexturePage } from '../select-texture/select-texture';
import { DiagnosisPage } from '../diagnosis/diagnosis';
import { Camera, CameraOptions } from '@ionic-native/camera';
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
	selectedColorHex: string = "";
	borderColors = {}; //Note the key has no # but the result does.
	fontColors = {}; //Note the key has no # but the result does.
	public base64Image: string;
	fireURL: string;
	dominantColor: string;

	constructor(public navCtrl: NavController, public db: AngularFireDatabase, private camera: Camera, private toastCtrl: ToastController) {
		db.list<any>('/Colors').valueChanges().subscribe(_rawcolors => {
			this.colors = _.sortBy(_rawcolors, "no");
			console.log("this.colors is: ", this.colors);
			this.setBorderColors(this.colors);
			this.setFontColors(this.colors);
		})

		initializeApp(environment.firebase);
	}

	analyze() {
		let color;
		console.log("analyzing...");
		let url = this.fireURL;
		//let url = 'https://firebasestorage.googleapis.com/v0/b/boop-a674c.appspot.com/o/images%2F1510245621.jpg?alt=media&token=fbfdeafa-fea9-4da1-af80-3ec157c436ad';
		sightengine("1801151869", "bBS92aZfoXDJKm9Y3p8u").check(['properties']).set_url(url).then(function (result) {
			//this will return a string of the dominant hex value
			if (result.status == "success") {
				console.log("result is: ", result);
				color = result.colors.dominant.hex;
				return color;
			}

		}).then((work) => {
			this.dominantColor = work;
			this.selectedColorHex = this.getNearestColor(work);
			console.log("this.selectedColorHex is: ", this.selectedColorHex);
		}).catch(function (err) {
			console.log(err);

		});
	}

	private options: CameraOptions = {
		quality: 50,
		destinationType: this.camera.DestinationType.DATA_URL,
		encodingType: this.camera.EncodingType.JPEG,
		mediaType: this.camera.MediaType.PICTURE
	}

	takePicture() {
		this.camera.getPicture(this.options).then((imageData) => {
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
			console.log("uploading...");
			this.fireURL = snapshot.downloadURL;
			this.analyze();
		})

	}

	onClickCamera() {
		this.flashToast();
		console.log(this.navCtrl.getActive().component.name);

	}

	onClick(color) {
		this.selectedColorHex = (this.selectedColorHex === color.hex) ? null : color.hex;
	}

	getNearestColor(inp_color) {
		let nearestColorHex, i, _dist;
		let smallestDistance = Infinity;
		for (i = 0; i < this.colors.length; i++) {
			_dist = this.calcDistance(this.colors[i].hex, inp_color);
			if (_dist < smallestDistance) {
				nearestColorHex = this.colors[i].hex;
				smallestDistance = _dist;
			}
		}
		return nearestColorHex;
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


	setBorderColors(_colors) {
		_.map(_colors, color => {
			this.borderColors[color.hex.substring(1)] = this.getBorderColor(color.hex);
		});
	}

	getBorderColor(hex) {
		switch (hex) {
			case ("#474a14"):
				return "#2a2e01";
			case ("#f5d88e"):
				return "#E5B86E";
			case ("#d1c295"):
				return "#B1A175";
			case ("#755e19"):
				return "#533E01";
			case ("#745426"):
				return "#534214";
			case ("#284b2C"):
				return "#183211";
			case ("#48a774"):
				return "#289754";
			case ("#882119"):
				return "#680302";
			case ("#f6f6f6"):
				return "#DEDEDE";
			case ("#3f2a04"):
				return "#211104";
			default:
				return hex;
		}
	}

	setFontColors(_colors) {
		_.map(_colors, color => {
			this.fontColors[color.hex.substring(1)] = this.getFontColor(color.hex);
		});
	}

	getFontColor(hex) {
		switch (hex) {
			case ("#f6f6f6"):
				return "#333";
			default:
				return "#fff";
		}
	}

	onClickContinue() {
		// this.navCtrl.push(SelectTexturePage, {selectedColor:this.selectedColor.hex, borderColor:this.getBorderColor(this.selectedColor.hex)});
		this.navCtrl.push(DiagnosisPage, { selectedColor: this.selectedColorHex });
	}

	testColor() {
		this.selectedColorHex = "#f6f6f6"
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
			message: 'Analyzing your image...',
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
