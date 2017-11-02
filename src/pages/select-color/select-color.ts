import { Component, ViewChild } from '@angular/core';
import { Nav, NavController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabaseModule, AngularFireDatabase,AngularFireObject } from 'angularfire2/database';
import { SelectTexturePage } from '../select-texture/select-texture';
import * as _ from 'lodash';

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

	constructor(public navCtrl: NavController, public db: AngularFireDatabase) {
		db.list<any>('/Colors').valueChanges().subscribe(_rawcolors=>
		{
			this.colors = _.sortBy(_rawcolors, "no");			
			this.setBorderColors(this.colors);
			this.setFontColors(this.colors);
		})

		//this.navCtrl.setRoot(SelectColorPage);
	}

	onClick(color){
		this.selectedColor= (this.selectedColor===color)?null:color;
	}

	
	setBorderColors(_colors){
		_.map(_colors, color=>{ 
			this.borderColors[color.hex.substring(1)]=this.getBorderColor(color.hex);
		});
	}

	getBorderColor(hex){
		switch(hex){
			case("#474A14"):
				return "#289754";
			case("#F5D88E"):
				return "#E5B86E";
			case("#D1C295"):
				return "#B1A175";
			case("#755E19"):
				return "#533E01";
			case("#745426"):
				return "#534214";
			case("#284B2C"):
				return "#183211";
			case("#48A774"):
				return "#289754";
			case("#882119"):
				return "#680302";
			case("#F6F6F6"):
				return "#DEDEDE";
			case("#3F2A04"):
				return "#211104";
			default:
				return hex;
		}
	} 

	setFontColors(_colors){
		_.map(_colors, color=>{ 
			this.fontColors[color.hex.substring(1)]=this.getFontColor(color.hex);
		});
	}

	getFontColor(hex){
		switch(hex){
			case("#f6f6f6"):
				return "#333";
			default:
				return "#fff";
		}
	} 

	onClickContinue(){
	    this.navCtrl.push(SelectTexturePage, {selectedColor:this.selectedColor.hex, borderColor:this.getBorderColor(this.selectedColor.hex)});
	}

	

	
}