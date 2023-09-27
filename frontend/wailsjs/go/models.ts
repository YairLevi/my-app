export namespace repositories {
	
	export class MonthEvent {
	    id: number;
	    // Go type: time
	    createdAt: any;
	    // Go type: time
	    updatedAt: any;
	    // Go type: gorm
	    deletedAt: any;
	    title: string;
	    // Go type: time
	    date: any;
	
	    static createFrom(source: any = {}) {
	        return new MonthEvent(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.createdAt = this.convertValues(source["createdAt"], null);
	        this.updatedAt = this.convertValues(source["updatedAt"], null);
	        this.deletedAt = this.convertValues(source["deletedAt"], null);
	        this.title = source["title"];
	        this.date = this.convertValues(source["date"], null);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class Note {
	    id: number;
	    // Go type: time
	    createdAt: any;
	    // Go type: time
	    updatedAt: any;
	    // Go type: gorm
	    deletedAt: any;
	    title: string;
	    content: string;
	
	    static createFrom(source: any = {}) {
	        return new Note(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.createdAt = this.convertValues(source["createdAt"], null);
	        this.updatedAt = this.convertValues(source["updatedAt"], null);
	        this.deletedAt = this.convertValues(source["deletedAt"], null);
	        this.title = source["title"];
	        this.content = source["content"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class WeekEvent {
	    id: number;
	    // Go type: time
	    createdAt: any;
	    // Go type: time
	    updatedAt: any;
	    // Go type: gorm
	    deletedAt: any;
	    title: string;
	    // Go type: time
	    startDate: any;
	    // Go type: time
	    endDate: any;
	
	    static createFrom(source: any = {}) {
	        return new WeekEvent(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.createdAt = this.convertValues(source["createdAt"], null);
	        this.updatedAt = this.convertValues(source["updatedAt"], null);
	        this.deletedAt = this.convertValues(source["deletedAt"], null);
	        this.title = source["title"];
	        this.startDate = this.convertValues(source["startDate"], null);
	        this.endDate = this.convertValues(source["endDate"], null);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

