import { Component, ViewChild } from '@angular/core';
import { Nav, NavController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabaseModule, AngularFireDatabase,AngularFireObject } from 'angularfire2/database';

import * as _ from 'lodash';

@Component({
  selector: 'page-select-texture',
  templateUrl: 'select-texture.html'
})
export class SelectTexturePage {
	@ViewChild(Nav) navi: Nav;
	
	textures: Array<any>;
	selectedTexture: any = null;

	constructor(public navCtrl: NavController, public db: AngularFireDatabase) {
		// db.list<any>('/Textures').valueChanges().subscribe(_rawtextures=>
		// {
		// 	this.textures = _rawtextures;
		// 	console.log("_rawtextures is: ", _rawtextures);
		// })
	}

	onClick(texture){
		this.selectedTexture= (this.selectedTexture===texture)?null:texture;
	}

	onClickContinue(){
	    // this.navi.setRoot(page.component, {boardId: page.params.bid, title:page.title});
	}
}