import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'sort'})
export class SortPipe implements PipeTransform {
  transform(array: Array<string>, args: string): Array<string> {
		if(array != undefined){
			array.sort((a: any, b: any) => {
				if ( (a[args]).toLowerCase() < (b[args]).toLowerCase() ){
	    		return -1;
				}else if( (a[args]).toLowerCase() > (b[args]).toLowerCase() ){
	        return 1;
	    	}else{
	    		return 0;	
	    	}
    	});
    	return array;
		}
  }
}