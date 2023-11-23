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
    phong_exponent
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
      color.components[0] * ambient.components[0],
      color.components[1] * ambient.components[1],
      color.components[2] * ambient.components[2]
    );
    //console.log(colorVectorSpecular);
    let L = ambientVector
      .add(colorVectorDiffuse.scaleBy(nl))
      .add(colorVectorSpecular.scaleBy(nh))
      .scaleBy(255);
    return L;
  }
}
