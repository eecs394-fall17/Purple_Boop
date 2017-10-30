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
	
	selectedColorHex: any;
	selectedColorName: any;
	severity: any;
	text: any;

	constructor(public navCtrl: NavController, public navParams: NavParams, public db: AngularFireDatabase) {
		this.selectedColorHex = navParams.get("selectedColor");
		db.list<any>('/Texts/'+this.selectedColorHex.substring(1)).valueChanges().subscribe(_rawdata=>
		{
			[this.selectedColorName, this.severity, this.text] = _rawdata;
		});
	}
}