import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabaseModule, AngularFireDatabase,AngularFireObject } from 'angularfire2/database';

import * as _ from 'lodash';

@Component({
  selector: 'page-select-color',
  templateUrl: 'select-color.html'
})
export class SelectColorPage {
	// colors: Array<{hex:string, name:string}>;
	// selectedColor: {hex:string, name:string};
	colors: Array<any>;
	selectedColor: any;

	raw_colors: AngularFireObject<any[]>;

	constructor(public navCtrl: NavController, public db: AngularFireDatabase) {
		db.list<any>('/Colors').valueChanges().subscribe(_rawcolors=>
		{
			this.colors = _rawcolors;
			console.log("_rawcolors is: ", _rawcolors);
		})
	}

	onClick(event){
		console.log("onClick with event:", event);
	}

}
