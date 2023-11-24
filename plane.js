import { Vector } from "./library/vector.js";
import { Primitive } from "./primitive.js";
export class Plane extends Primitive {
  constructor(diffuse, 
    ambient, 
    specular, 
    phong_exponent, 
    mirror,
    point, 
    normal) {
    super(diffuse, ambient, specular, phong_exponent, mirror);
    this.point = new Vector(point);
    this.normal = new Vector(normal);
  }
  _tFinden(eye, rayDir) {
    const EPSILON = 0.00000001
    let denom = this.normal.dotProduct(rayDir)
    if (Math.abs(denom) > EPSILON)
    {
      var t = this.point.subtract(eye).dotProduct(this.normal) / denom
      return t > EPSILON ? t : -1
    }
    else return -1
  }
  intersect(e, d) {
    return this._tFinden(e, d);
  }
  getNormal(intersection) {
    this.normal = this.normal.normalize();
    return this.normal;
  }
}
