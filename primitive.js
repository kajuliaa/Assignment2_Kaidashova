import { EPSILON } from "./library/constants.js";
import { Vector } from "./library/vector.js";

export function findClosestIntersection(objects, eye, d){
  let min = 10000;
  let o = null;
  for (let obj of objects) {
    let objDist = obj.intersect(eye, d);
    if (objDist === -1 || objDist < 0) continue;

    if (objDist < min) {
      min = objDist;
      o = obj;
    }
  }
  return { object: o, t: min }
}

export class Primitive {
  
  constructor(diffuse,
    ambient,
    specular,
    phong_exponent,
    mirror) {
    this.diffuse = new Vector(diffuse);
    this.ambient = new Vector(ambient);
    this.specular = new Vector(specular);
    this.phong_exponent = phong_exponent;
    this.mirror = new Vector(mirror);
  }

  printColor() {
    console.log(this.diffuse);
    
  }

  showLight(
    eye,
    d,
    dist,
    lights,
    objects
  ) {
    let intersection = eye.add(d.scaleBy(dist));
    let vVector = eye.subtract(intersection); //v Vector
    vVector = vVector.normalize();
    const normal = this.getNormal(intersection)

    let summaryLight = new Vector(0, 0, 0);
    for (let l of lights) {
      //console.log(l);
      let lightPos = l.position;
      //console.log(lightPos);
      let lightVector = lightPos.subtract(intersection);
      lightVector = lightVector.normalize();

      //shadows
      let shadows = false;
      let length = lightPos.subtract(intersection).length()
      for (let obj of objects) {
        let objDist = obj.intersect(intersection, lightVector);
        if (objDist == -1 || objDist >= length) continue;
        shadows = true;
        break;
      }
      if (shadows) continue

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
      nh = Math.pow(nh, this.phong_exponent); //phong exponent pow
      let colorVectorDiffuse = this.diffuse.mul(l.color);
      let colorVectorSpecular = this.specular.mul(l.color);

      summaryLight = summaryLight
        .add(colorVectorDiffuse.scaleBy(nl))
        .add(colorVectorSpecular.scaleBy(nh));
      //console.log(summaryLight);
    }

    let ambientVector = this.ambient.scaleBy(0.2);

    if(this.mirror.components[0] > 0 && this.mirror.components[1] > 0 && this.mirror.components[2] > 0){
      let directionVector = vVector.negate();
      let rVector = directionVector.subtract(
        normal.scaleBy(2).scaleBy(directionVector.dotProduct(normal))
      );
  
      const result = findClosestIntersection(objects, intersection, rVector)
      if(result.object){
        const c = result.object.showLight(intersection,rVector,result.t,lights,objects)
        summaryLight = summaryLight.add(c.mul(this.mirror))
      }
    }
    return ambientVector.add(summaryLight);
  }
}
