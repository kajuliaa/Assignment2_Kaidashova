import { Vector } from "./library/vector.js";
import { Primitive } from "./primitive.js";
export class Plane extends Primitive {
  constructor(color, point, normal, ambient, specular, phong_exponent, mirror) {
    super(color);
    this.point = point;
    this.normal = normal;
    this.ambient = new Vector(ambient);
    this.specular = new Vector(specular);
    this.phong_exponent = new Vector(phong_exponent);
    this.mirror = new Vector(mirror);
  }
  _tFinden(e, d, p, n) {
    let beding = d.dotProduct(n);
    if (beding >= 0) {
      return -1;
    } else {
      let t = (p.dotProduct(n) - e.dotProduct(n)) / d.dotProduct(n);
      return t;
    }
  }
  intersect(e, d) {
    return this._tFinden(e, d, this.point, this.normal);
  }
  getNormal(intersection) {
    this.normal = this.normal.normalize();
    return this.normal;
  }
}
