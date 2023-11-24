import { Vector } from "./library/vector.js";

export class Light {
  constructor(position, color) {
    this.position = new Vector(position);
    this.color = new Vector(color);
  }
}
