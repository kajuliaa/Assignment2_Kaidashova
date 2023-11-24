import { EPSILON } from "./library/constants.js";
import { Vector } from "./library/vector.js";
export class Primitive {
  constructor(color) {
    this.color = color;
  }

  printColor() {
    console.log(this.color);
  }

  showLight(
    color,
    intensity,
    normal,
    light,
    ambient,
    hVector,
    specular,
    phong_exponent,
    mirror,
    rVector,
    shadows
  ) {
    let nl = normal.dotProduct(light);
    if (nl < 0) {
      nl = 0;
    }

    let nh = normal.dotProduct(hVector); //dotProduct of normal vector n and halfvector h
    if (nh < 0) {
      nh = 0;
    }
    nh = Math.pow(nh, phong_exponent); //phong exponent pow

    let colorVectorDiffuse = new Vector(
      color.components[0] * intensity.components[0],
      color.components[1] * intensity.components[1],
      color.components[2] * intensity.components[2]
    );
    let colorVectorSpecular = new Vector(
      intensity.components[0] * specular.components[0],
      intensity.components[1] * specular.components[1],
      intensity.components[2] * specular.components[2]
    );

    let ambientVector = new Vector(
      0.2 * ambient.components[0],
      0.2 * ambient.components[1],
      0.2 * ambient.components[2]
    );
    //Ideal specular reflektion
    let IdealSpecular = new Vector(
      mirror.components[0] * rVector.components[0],
      mirror.components[1] * rVector.components[1],
      mirror.components[2] * rVector.components[2]
    );
    //console.log(colorVectorSpecular);
    let L = ambientVector
      .add(colorVectorDiffuse.scaleBy(nl))
      .add(colorVectorSpecular.scaleBy(nh))
      .scaleBy(255);
    if (shadows) {
      return ambientVector.scaleBy(255);
    } else {
      return L;
    }
  }
}
