import { Vector } from "./library/vector.js";
import { Primitive } from "./primitive.js";
export class Plane extends Primitive {
  constructor(color, point, normal) {
    super(color);
    this.point = point;
    this.normal = normal;
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
