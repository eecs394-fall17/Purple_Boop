import { Component, ViewChild } from '@angular/core';
import { Nav, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabaseModule, AngularFireDatabase,AngularFireObject } from 'angularfire2/database';
import { DiagnosisPage } from '../diagnosis/diagnosis';
import * as _ from 'lodash';
import { textureService} from '../../app/services/texture-service';


@Component({
  selector: 'page-select-texture',
  templateUrl: 'select-texture.html'
})
export class SelectTexturePage {
	selectedColor:any;
	imageSRC:any;
	textureJsonData:any;

	currentJson:any;
	currentQuestion:string;

	diagnosisJson:string;

	constructor(public navCtrl: NavController, public navParams: NavParams, public db: AngularFireDatabase, private textServ: textureService) {
		this.selectedColor = navParams.get("selectedColor");
		console.log("this.selectedColor has been selected and set to : ", this.selectedColor);
		this.imageSRC = navParams.get("image"); 

		this.textServ.getData().subscribe((data) => {
		  this.textureJsonData = data;
		  console.log("textureJsonData ", this.textureJsonData);
		  this.currentJson=this.textureJsonData[this.selectedColor.name]
		  console.log("currentJson ", this.currentJson);
		  this.extractInfo();
		  // console.log("currentJson2 ", this.currentJson);
		});
	}

	onClick(outcome){
		console.log("outcome is: ", outcome);
		console.log("this.currentJson was: ", this.currentJson);
		this.currentJson = this.currentJson["options"][outcome]
		console.log("this.currentJson is now: ", this.currentJson);
		this.extractInfo();
	}
	
	extractInfo(){
		console.log("this.extractInfo() called");
		if(this.currentJson["type"]=="question"){
			this.currentQuestion=this.currentJson["response"];
		}
		else{
			console.log('this.currentJson["type"] : ',this.currentJson["type"]);
			this.diagnosisJson=this.currentJson
			this.moveToNextPage();
		}
	}

	moveToNextPage(){
		console.log("moving to Next Page with response set to: ", this.diagnosisJson);
		this.navCtrl.push(DiagnosisPage, { selectedColor: this.selectedColor, image: this.imageSRC, response: this.diagnosisJson});	
	}

}