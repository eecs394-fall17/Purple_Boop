
import { Component, ViewChild } from '@angular/core';
import { Nav, NavController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabaseModule, AngularFireDatabase, AngularFireObject,  } from 'angularfire2/database';
import { SelectTexturePage } from '../select-texture/select-texture';
import { DiagnosisPage } from '../diagnosis/diagnosis';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { storage, initializeApp } from 'firebase';
import { environment } from '../../environments/environment';

import * as _ from 'lodash';
import * as sightengine from 'sightengine';


@Component({
	selector: 'page-select-color',
	templateUrl: 'select-color.html'
})
export class SelectColorPage { 
	// @ViewChild(Nav) navi: Nav;
	// colors: Array<{hex:string, name:string}>;
	// selectedColor: {hex:string, name:string};
	colors: Array<any>;
	selectedColor: any = null;
	borderColors = {}; //Note the key has no # but the result does.
	fontColors = {}; //Note the key has no # but the result does.
	public base64Image: string;
	fireURL: string;
	dominantColor: string;




	constructor(public navCtrl: NavController, public db: AngularFireDatabase, private camera: Camera) {
		db.list<any>('/Colors').valueChanges().subscribe(_rawcolors => {
			this.colors = _.sortBy(_rawcolors, "no");
			this.setBorderColors(this.colors);
			this.setFontColors(this.colors);
		})

		initializeApp(environment.firebase);
	}
	

	
	analyze() {
		let color;
		console.log("analyzing...");
		let url = this.fireURL;
		//url = 'https://firebasestorage.googleapis.com/v0/b/boop-a674c.appspot.com/o/images%2F1510133588.jpg?alt=media&token=cf9f3f39-e166-4de4-b0e8-111431be083b';
		sightengine("1801151869", "bBS92aZfoXDJKm9Y3p8u").check(['properties']).set_url(url).then(function (result) {
			//this will return a string of the dominant hex value
			//console.log(result.colors.dominant.hex);
			color = result.colors.dominant.hex;
			return color;
		}).then((work) => {
			this.dominantColor = work;
			console.log(this.dominantColor);
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

	upload(){
		const rootRef = storage().ref();
		const filename = Math.floor(Date.now() / 1000);
		let imageRef = rootRef.child(`images/${filename}.jpg`)
		
		imageRef.putString(this.base64Image, 'data_url').then(snapshot => {
			console.log("uploading...");
			this.fireURL = snapshot.downloadURL;
			console.log(this.fireURL);
			this.analyze();
		})
		
	}

	onClickCamera() {
		this.takePicture();
	}

	onClick(color) {
		this.selectedColor = (this.selectedColor === color) ? null : color;
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
		this.navCtrl.push(DiagnosisPage, { selectedColor: this.selectedColor.hex });
	}




}