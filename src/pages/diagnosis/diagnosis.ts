import { Component, ViewChild } from '@angular/core';
import { Nav, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabaseModule, AngularFireDatabase,AngularFireObject } from 'angularfire2/database';
import * as _ from 'lodash';
import { SocialSharing } from '@ionic-native/social-sharing';


@Component({
  selector: 'page-diagnosis',
  templateUrl: 'diagnosis.html'
})
export class DiagnosisPage {
	@ViewChild(Nav) navi: Nav;
	
	selectedColorHex: any;
	selectedColorName: any;
	severity: any;
	text: any;
	imageSRC: any;

	constructor(public navCtrl: NavController, public navParams: NavParams, public db: AngularFireDatabase, private socialSharing: SocialSharing) {
		this.selectedColorHex = navParams.get("selectedColor");
		this.imageSRC = navParams.get("image"); 
		console.log(this.imageSRC);
		
		db.list<any>('/Texts/'+this.selectedColorHex.substring(1)).valueChanges().subscribe(_rawdata=>
		{
			
			[this.selectedColorName, this.severity, this.text] = _rawdata;
		});
	}

	shareMe(){
		var options = {
			message: 'share this', // not supported on some apps (Facebook, Instagram)
			subject: 'the subject', // fi. for email
			//files: ['', ''], // an array of filenames either locally or remotely
			//url: 'https://www.website.com/foo/#bar?a=b',
			chooserTitle: 'Pick an app' // Android only, you can override the default share sheet title
		  } 

		this.socialSharing.shareWithOptions(options);
	}

	backToRoot(){
		this.navCtrl.popToRoot();
	}


	 onSuccess(result) {
		console.log("Share completed? " + result.completed); // On Android apps mostly return false even while it's true
		console.log("Shared to app: " + result.app); // On Android result.app is currently empty. On iOS it's empty when sharing is cancelled (result.completed=false)
	  }
	  
	  onError(msg) {
		console.log("Sharing failed with message: " + msg);
	  }

	 options = {
		message: 'share this', // not supported on some apps (Facebook, Instagram)
		subject: 'the subject', // fi. for email
		files: ['', ''], // an array of filenames either locally or remotely
		url: '',
		chooserTitle: 'Pick an app' // Android only, you can override the default share sheet title
	  }
}