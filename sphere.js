import { Vector } from "./library/vector.js";
import { Primitive } from "./primitive.js";

export class Sphere extends Primitive {
  constructor(color, center, radius, ambient, specular, phong_exponent) {
    super(color);
    this.center = center;
    this.radius = radius;
    this.ambient = new Vector(ambient);
    this.specular = new Vector(specular);
    this.phong_exponent = new Vector(phong_exponent);
  }

  _diskriminant(e, d, c, r) {
    let ec = e.subtract(c);
    let dec = d.dotProduct(ec);
    let leftPart = dec * dec;
    let rightPart = d.dotProduct(d) * (ec.dotProduct(ec) - r * r);
    let diskri = leftPart - rightPart;
    return diskri;
  }

  _tFinden(e, d, c, r) {
    let diskrim = this._diskriminant(e, d, c, r);
    let ec = e.subtract(c);
    let invertD = d.negate();
    if ((diskrim) => 0) {
      let t1 = (invertD.dotProduct(ec) + Math.sqrt(diskrim)) / d.dotProduct(d);
      let t2 = (invertD.dotProduct(ec) - Math.sqrt(diskrim)) / d.dotProduct(d);
      if (t1 <= t2) {
        return t1;
      } else {
        return t2;
      }
    } else {
      return -1;
    }
  }

  intersect(e, d) {
    return this._tFinden(e, d, this.center, this.radius);
  }

  getNormal(intersection) {
    let normal = intersection.subtract(this.center);
    normal = normal.normalize();
    return normal;
  }
}
