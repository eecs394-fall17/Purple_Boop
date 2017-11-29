import { Component, ViewChild } from '@angular/core';
import { Nav, NavController, NavParams, Navbar } from 'ionic-angular';
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

	path:string[]=[]; //The list of actions you've taken: ["no","no", "yes"]
	pageNumber: number = 0; // pageNumber=0 as soon as you open the selectColor page. 

	@ViewChild(Navbar) navBar: Navbar;

	ionViewDidLoad(){
		this.setBackButtonAction();
	}

	setBackButtonAction(){
		this.navBar.backButtonClick = () => {
			if(this.pageNumber==0){
				this.navCtrl.pop()
			} else{
				this.goBack();
			}
		}
	}

	constructor(public navCtrl: NavController, public navParams: NavParams, public db: AngularFireDatabase, private textServ: textureService) {
		this.selectedColor = navParams.get("selectedColor");
		this.imageSRC = navParams.get("image"); 

		this.textServ.getData().subscribe((data) => {
		  this.textureJsonData = data;
		  this.currentJson=this.textureJsonData[this.selectedColor.name]
		  this.extractInfo(this.currentJson);
		});
	}

	onClick(outcome){
		this.pageNumber+=1;
		this.path.concat([outcome]);
		let _c = this.currentJson["options"][outcome]
		let _nextPageIsQ = this.extractInfo(_c);
		if(_nextPageIsQ){
			this.currentJson = _c;
		}
	}

	goBack(){
		let _c = this.textureJsonData[this.selectedColor.name]
		let _p = 0;
		for(let i = 0; i<this.path.length; i++){
			_p+=1;
			_c = _c["options"][this.path[i]];
		}
		this.currentJson = _c;
		this.pageNumber=_p;
		this.extractInfo(_c);
	}
	
	extractInfo(_json){
		if(_json["type"]=="question"){
			this.currentQuestion= _json["response"];
			return true;
		}
		else{
			this.diagnosisJson= _json
			this.moveToNextPage();
			return false;
		}
	}

	moveToNextPage(){
		this.navCtrl.push(DiagnosisPage, { selectedColor: this.selectedColor, image: this.imageSRC, response: this.diagnosisJson});	
	}

}