let p = [];

function setup() {
	createCanvas( 600, 600 );

	colorMode( HSL, 100 );

	for ( let i = 0; i < 20; i++ ) {
		p.push( new Point() );
	}
}

function draw() {
	background( 0 );

	for ( let i of p ) {
		i.update();
		i.display();
		if ( i.outOfBounds() && i.path.length == 0 ) {
			p.splice( p.indexOf( i ), 1 );
			p.push( new Point() );
		}
	}
	console.log( floor( getFrameRate() ) );
}

class Point {
	constructor() {
		this.seed = millis() * second();
		this.dn = 0;

		noiseSeed( this.seed );
		this.oa = random( 2 * Math.PI );
		this.a = noise( this.dn ) * 2 * Math.PI + this.oa;

		this.mag = 0;
		this.dmag = random( 0.25, 0.5 );

		this.pos = createVector( cos( this.a ) * this.mag + width/2, sin( this.a ) * this.mag + height/2 );

		this.path = [];
		this.maxTrail = floor( random( 10, 100 ) );
	}

	update() {
		if ( !this.outOfBounds() ) {
			this.path.push( this.pos.copy() );

			noiseSeed( this.seed );
			this.a = noise( this.dn ) * 2 * Math.PI + this.oa;
			this.pos = createVector( cos( this.a ) * this.mag + width/2, sin( this.a ) * this.mag + height/2 );

			if ( this.path.length > this.maxTrail ) {
				this.path.shift();
			}

			this.mag += this.dmag;
			this.dn += 0.005;
			// this.oa += 0.005;
		} else {
			this.path.shift();
		}
	}

	display() {
		stroke( 0, 100, 100 );

		for ( let i = 1; i < this.path.length; i++ ) {
			strokeWeight( map( i, 1, this.path.length, 1, 5 ) );
			line( this.path[i-1].x, this.path[i-1].y, this.path[i].x, this.path[i].y );
		}
	}

	outOfBounds() {
		if ( this.pos.x > width || this.pos.x < 0 ) {
			return true;
		} else if ( this.pos.y > height || this.pos.y < 0 ) {
			return true;
		} else {
			return false;
		}
	}
}