import VectorGameObject from "../GameObject/VectorGameObject.js";

//TODO: add flag to toggle text sizing be optional between absolute and relative
export default class TextBox extends VectorGameObject {
	layout = {
		x: 0,
		xRatio: 0,
		y: 0,
		yRatio: 0,
		width: 0,
		widthRatio: 0,
		height: 0,
		heightRatio: 0,
	};

	style = {
		fill: this.p5.color(0, 0, 0),
		hoverFill: this.p5.color(123, 123, 123),
		pressedFill: this.p5.color(255, 255, 255),
		loadingFill: this.p5.color(62, 62, 62),
		disabledFill: this.p5.color(125, 0, 0),
	};

	textStyle = {
		text: "",
		textRatio: 5, // this is from the width of the text box: text size = width / ratio
		textSize: 0,
		textFill: this.p5.color(255, 255, 255),
		textStroke: this.p5.color(255, 255, 255),
		textStrokeWeight: 0,
		textStatic: false, // if true, text will not be resized when text box is resized
	};

	states = {
		idle: "fill",
		disabled: "disabledFill",
	};

	state = this.states.idle;
    //displayInfo = "";

    /*
    get displayInfo() {
        return this.displayInfo;
    }

    set displayInfo(info) {
        this.displayInfo = info;
    }
    */

	// Pass in objects matching the format for layout and style above to override defaults
	constructor(layout = {}, style = {}, textStyle = {}, disabled = false) {
		super(0, 0, {}, true, 5, 255, 0, 1, 1, false);

		Object.assign(this.layout, layout);
		Object.assign(this.style, style);
		Object.assign(this.textStyle, textStyle);

		this.#updateLayout();

		this.state = disabled ? this.states.disabled : this.states.idle;
        this.displayInfo = "";
	}

	render() {
		// skip rendering if our fill was set to null
		if (this.style[this.state] !== null) {
			this.p5.push();

			this.p5.fill(this.style[this.state]);
			this.p5.rect(this.layout.x, this.layout.y, this.layout.width, this.layout.height);

			this.p5.stroke(this.textStyle.textStroke);
			this.p5.strokeWeight(this.textStyle.textStrokeWeight);
			this.p5.textSize(this.textStyle.textSize);
			//this.p5.textAlign(this.p5.CENTER, this.p5.CENTER);
			this.p5.textAlign(this.p5.CENTER, this.p5.CENTER);
			this.p5.textFont("Oswald");
			this.p5.fill(this.textStyle.textFill);
			//this.p5.text(this.textStyle.text, this.layout.x + this.layout.width / 2, this.layout.y + this.layout.height / 2);
			this.p5.text(this.displayInfo, this.layout.x + this.layout.width / 2, this.layout.y + this.layout.height / 2);

			this.p5.pop();
		}
	}


	// use this function when resizing canvas
	updateSize() {
		if (this.layout.xRatio && this.layout.yRatio) {
			const cWidth = this.gameSession.canvasWidth;
			const cHeight = this.gameSession.canvasHeight;

			this.layout.x = cWidth * this.layout.xRatio;
			this.layout.y = cHeight * this.layout.yRatio;
			this.layout.width = cWidth * this.layout.widthRatio;
			this.layout.height = cHeight * this.layout.heightRatio;

			if (!this.textStyle.textStatic) this.textStyle.textSize = this.layout.width / this.textStyle.textRatio;
		}
	}

	// called when object is created, sets the required variables for proper sizing
	#updateLayout() {
		const cWidth = this.gameSession.canvasWidth;
		const cHeight = this.gameSession.canvasHeight;

		// prioritize ratios, update other values if ratios are set already
		if (this.layout.xRatio && this.layout.yRatio) {
			this.layout.x = cWidth * this.layout.xRatio;
			this.layout.y = cHeight * this.layout.yRatio;
			this.layout.width = cWidth * this.layout.widthRatio;
			this.layout.height = cHeight * this.layout.heightRatio;
		} else {
			// otherwise we have x/y/width/height, set ratios based on those
			this.layout.xRatio = this.layout.x / cWidth;
			this.layout.yRatio = this.layout.y / cHeight;
			this.layout.widthRatio = this.layout.width / cWidth;
			this.layout.heightRatio = this.layout.height / cHeight;
		}

		if (!this.textStyle.textSize) this.textStyle.textSize = this.layout.width / this.textStyle.textRatio;
	}

	//abstract method - useful for overriding in child class.
	onButtonReleased() {}
}
