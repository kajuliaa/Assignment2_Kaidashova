/*
Author: Jacob Justice
Assignment 01: Ray Tracing
CGA

This simple program will update the canvas to black, 
and then increase the red value by a small amount after each subsequent button click

The red value is increased in the function raytrace, in order
for the raytrace function to run, a scene file needs to be selected
*/

var color = 0;

// ------------ DO NOT EDIT BELOW --------------
// on button click, load the scene file and raytrace that scene
import { parseJsonFile, imageDataFromCanvas } from "./helper.js";
import { toRadians } from "./library/utils.js";
import { Vector } from "./library/vector.js";
import { Sphere } from "./sphere.js";
import { Plane } from "./plane.js";
import { Light } from "./light.js";
import { EPSILON } from "./library/constants.js";

var scene = null;
document.getElementById("submit").onclick = async function () {
  scene = await parseJsonFile(myfile.files[0]);
  raytrace(scene);
};
// ------------ DO NOT EDIT ABOVE --------------

function raytrace(scene) {
  var [imageData, ctx] = imageDataFromCanvas(
    document.getElementById("canvas"),
    scene
  );
  // --------------------- YOUR CODE BELOW ------------------
  function setPixel(x, y, color) {
    let offSet = (y * scene.width + x) * 4;
    imageData.data[offSet] = color[0];
    imageData.data[offSet + 1] = color[1];
    imageData.data[offSet + 2] = color[2];
    imageData.data[offSet + 3] = 255;
  }
  color += 20;
  // run raytracing algorithm on the scene
  let lookat = new Vector(scene.lookat);
  let eye = new Vector(scene.eye);
  let direction = lookat.subtract(eye);
  let w = direction.negate();
  w = w.normalize();
  let len = direction.length();

  let t = Math.tan(toRadians(scene.fov_angle) / 2) * len;
  let b = -t;
  let aspect_ratio = scene.width / scene.height;
  let r = aspect_ratio * t;
  let l = -r;

  let upVECTOR = new Vector([0, 1, 0]);
  let U = upVECTOR.crossProduct(w);
  let V = w.crossProduct(U);

  let objects = scene.surfaces.map((surface) => {
    if (surface.type === "sphere") {
      return new Sphere(
        surface.diffuse,
        surface.ambient,
        surface.specular,
        surface.phong_exponent,
        surface.mirror,
        surface.center,
        surface.radius
      );
    } else {
      let plane = new Plane(
        surface.diffuse,
        surface.ambient,
        surface.specular,
        surface.phong_exponent,
        surface.mirror,
        surface.point,
        surface.normal
      );
      return plane;
    }
  });

  let lights = scene.lights.map((lighting) => {
    let light = new Light(lighting.position, lighting.color);
    return light;
  });
  //console.log(lights);

  const BLACK = new Vector([0, 0, 0]);
  for (var i = 0; i < scene.width; i += 1) {
    for (var j = 0; j < scene.height; j += 1) {
      let min = 10000;
      let o = null;
      let u = l + ((r - l) * (i + 0.5)) / scene.width;
      let v = -(b + ((t - b) * (j + 0.5)) / scene.height);
      let d = w.scaleBy(-len).add(U.scaleBy(u)).add(V.scaleBy(v));
      
      for (let obj of objects) {
        let objDist = obj.intersect(eye, d);
        if (objDist === -1 || objDist < 0) continue;

        if (objDist < min) {
          min = objDist;
          o = obj;
        }
      }

      if (o) {
        const light = o.showLight(
          eye,
          d,
          min,
          lights,
          objects
        ).components

        setPixel(
          i,
          j,
          light
        );
      } else {
        setPixel(i, j, BLACK.components);
      }
    }
  }

  // display image on canvas element
  ctx.putImageData(imageData, 0, 0);
}
