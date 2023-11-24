import { Vector } from "./library/vector.js";
import { Primitive } from "./primitive.js";

export class Sphere extends Primitive {
  constructor(
    color,
    center,
    radius,
    ambient,
    specular,
    phong_exponent,
    mirror
  ) {
    super(color);
    this.center = center;
    this.radius = radius;
    this.ambient = new Vector(ambient);
    this.specular = new Vector(specular);
    this.phong_exponent = new Vector(phong_exponent);
    this.mirror = new Vector(mirror);
  }

  _diskriminant(e, d, c, r) {
    let ec = e.subtract(c);
    let dec = d.dotProduct(ec);
    let leftPart = dec * dec;
    let rightPart = d.dotProduct(d) * (ec.dotProduct(ec) - r * r);
    let diskri = leftPart - rightPart;
    return diskri;
  }

  _tFinden(eye, rayDir) {
    const d_dot_d = rayDir.dotProduct(rayDir)
    let e_minus_c = eye.subtract(this.center)
    let d_dot_emc = rayDir.dotProduct(e_minus_c)
    let emc_dot_emc = (e_minus_c.dotProduct(e_minus_c))
    let discriminant = Math.pow(d_dot_emc,2) - d_dot_d*(emc_dot_emc - Math.pow(this.radius,2))
    let t_ = -1
    if (discriminant >= 0) {
        t_ = (-d_dot_emc - Math.pow(discriminant,0.5))/d_dot_d
        if (t_ < 0) {
            t_ = (-d_dot_emc + Math.pow(discriminant,0.5))/d_dot_d
        }
    }
    const EPSILON = 0.00000001
    return t_ > EPSILON ? t_ : -1
  }

  intersect(e, d) {
    return this._tFinden(e, d);
  }

  getNormal(intersection) {
    let normal = intersection.subtract(this.center);
    normal = normal.normalize();
    return normal;
  }
}
