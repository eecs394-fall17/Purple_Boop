import { Component, ViewChild } from '@angular/core';
import { Nav, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabaseModule, AngularFireDatabase,AngularFireObject } from 'angularfire2/database';
import { DiagnosisPage } from '../diagnosis/diagnosis';
import * as _ from 'lodash';

@Component({
  selector: 'page-select-texture',
  templateUrl: 'select-texture.html'
})
export class SelectTexturePage {
	@ViewChild(Nav) navi: Nav;
	
	textures: Array<any>;
	selectedTexture: any = null;
	selectedColorHex:string;
	borderColor:string;

	constructor(public navCtrl: NavController, public navParams: NavParams, public db: AngularFireDatabase) {
		this.selectedColorHex = navParams.get("selectedColor");
		this.borderColor = navParams.get("borderColor");
		db.list<any>('/Textures/'+this.selectedColorHex.substring(1)).valueChanges().subscribe(_rawtextures=>
		{
			this.textures = _rawtextures;
			console.log("_rawtextures is: ", _rawtextures);
		})
	}

	onClick(texture){
		this.selectedTexture= (this.selectedTexture===texture)?null:texture;
	}

	onClickContinue(){
	    this.navCtrl.setRoot(DiagnosisPage, {selectedColor:this.selectedColorHex});
	}
}