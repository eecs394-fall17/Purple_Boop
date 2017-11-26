import { Component, ViewChild } from '@angular/core';
import { Nav, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabaseModule, AngularFireDatabase,AngularFireObject } from 'angularfire2/database';

import * as _ from 'lodash';

@Component({
  selector: 'page-diagnosis',
  templateUrl: 'diagnosis.html'
})
export class DiagnosisPage {
	@ViewChild(Nav) navi: Nav;
	
	selectedColor: any;
	severity: any;
	text: any;
	imageSRC: any;
	response:any;

	constructor(public navCtrl: NavController, public navParams: NavParams, public db: AngularFireDatabase) {
		this.selectedColor = navParams.get("selectedColor");
		this.imageSRC = navParams.get("image"); 
		if(this.selectedColor.name==="white"){
			this.severity = navParams.get("severity");
			this.text = navParams.get("text");
		}
		else{
			console.log("name of color is: ", this.selectedColor.name)
			[this.severity, this.text] = this.extractJsonInfo(navParams.get("response"));
		}
		console.log(this.imageSRC);
	}

	extractJsonInfo(json){
		console.log("eJI called with: ", json);
		return [json["severity"], json["response"]];
	}
}