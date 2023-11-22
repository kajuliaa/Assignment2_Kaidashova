import { Vector } from "./library/vector.js";
export class Primitive {
  constructor(color) {
    this.color = color;
  }

  printColor() {
    console.log(this.color);
  }

  lambert(color, intensity, normal, light) {
    let nl = normal.dotProduct(light);

    if (nl < 0) {
      nl = 0;
    }
    //console.log(nl);
    let L = new Vector([nl * 255, nl * 255, nl * 255]); //color.scaleBy(nl);
    return L;
  }
}
