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
    ambient,
    vVector,
    specular,
    phong_exponent,
    mirror,
    rVector,
    shadows,
    lights,
    intersection
  ) {
    console.log(lights);
    let summaryLight = new Vector(0, 0, 0);
    for (let l of lights) {
      //console.log(l);
      let lightPos = l.position;
      //console.log(lightPos);
      let lightVector = lightPos.subtract(intersection);
      lightVector = lightVector.normalize();
      let color = l.color;
      let hVector = vVector.add(lightVector);
      hVector = hVector.normalize(); // h Vector
      let nl = normal.dotProduct(lightVector);
      if (nl < 0) {
        nl = 0;
      }
      //console.log(nl);
      let nh = normal.dotProduct(hVector); //dotProduct of normal vector n and halfvector h
      if (nh < 0) {
        nh = 0;
      }
      nh = Math.pow(nh, phong_exponent); //phong exponent pow
      let colorVectorDiffuse = new Vector(
        color.components[0] * l.color.components[0],
        color.components[1] * l.color.components[1],
        color.components[2] * l.color.components[2]
      );
      let colorVectorSpecular = new Vector(
        l.color.components[0] * specular.components[0],
        l.color.components[1] * specular.components[1],
        l.color.components[2] * specular.components[2]
      );

      summaryLight = summaryLight
        .add(colorVectorDiffuse.scaleBy(nl))
        .add(colorVectorSpecular.scaleBy(nh));
      //console.log(summaryLight);
    }

    /*let colorVectorDiffuse = new Vector(
      color.components[0] * intensity.components[0],
      color.components[1] * intensity.components[1],
      color.components[2] * intensity.components[2]
    );*/
    /*let colorVectorSpecular = new Vector(
      intensity.components[0] * specular.components[0],
      intensity.components[1] * specular.components[1],
      intensity.components[2] * specular.components[2]
    );*/

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
    //console.log(summaryLight);
    //console.log(colorVectorSpecular);
    let L = ambientVector.add(summaryLight).scaleBy(255);
    if (shadows) {
      return ambientVector.scaleBy(255);
    } else {
      return L;
    }
  }
}
