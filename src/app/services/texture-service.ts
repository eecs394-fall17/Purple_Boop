import {Injectable} from '@angular/core';
import { Http, Response} from '@angular/http';
import 'rxjs/Rx';

@Injectable()
export class textureService {
    constructor(public http:Http) {}

	getData() {
	    return this.http.get("../assets/data/texture.json")
	        .map((res:Response) => res.json()); //records in this case
	}
}