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
    let colorVector = new Vector(
      color.components[0] * intensity.components[0],
      color.components[1] * intensity.components[1],
      color.components[2] * intensity.components[2]
    );
    //console.log(colorVector.scaleBy(nl));
    //console.log(nl);
    let L = colorVector.scaleBy(nl); //color.scaleBy(nl);
    //console.log(L);
    return L;
  }
}
