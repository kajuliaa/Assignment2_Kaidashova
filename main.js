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
    let color = new Vector(surface.diffuse);
    if (surface.type === "sphere") {
      let center = new Vector(surface.center);
      let sphere = new Sphere(
        color,
        center,
        surface.radius,
        surface.ambient,
        surface.specular,
        surface.phong_exponent,
        surface.mirror
      );
      return sphere;
    } else {
      let point = new Vector(surface.point);
      let normal = new Vector(surface.normal);
      let plane = new Plane(
        color,
        point,
        normal,
        surface.ambient,
        surface.specular,
        surface.phong_exponent,
        surface.mirror
      );
      return plane;
    }
  });

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
        if (objDist === -1) continue;
        if (objDist < min) {
          min = objDist;
          o = obj;
        }
      }

      if (o) {
        let intersection = eye.add(d.scaleBy(min));
        let normal = o.getNormal(intersection);
        let lightPos = new Vector(scene.lights[0].position);
        let lightVector = lightPos.subtract(intersection);
        lightVector = lightVector.normalize();
        let color = new Vector(scene.lights[0].color);
        //ambient shading
        let ambient = o.ambient;
        //Blinn-Phong shading
        let vVector = eye.subtract(intersection); //v Vector
        vVector = vVector.normalize();
        let hVector = vVector.add(lightVector);
        hVector = hVector.normalize(); // h Vector
        let specular = o.specular;
        let phong_exponent = o.phong_exponent.components;
        //ideal specular reflection

        let directionVector = vVector.negate();
        let rVector = directionVector.subtract(
          normal.scaleBy(2).scaleBy(directionVector.dotProduct(normal))
        );
        //shadows
        let shadows = false;
        let length = lightPos.subtract(intersection).length()
        for (let obj of objects) {
          let objDist = obj.intersect(intersection, lightVector);
          if (objDist == -1 || objDist >= length) continue;
          shadows = true;
          break;
        }

        setPixel(
          i,
          j,
          o.showLight(
            o.color,
            color,
            normal,
            lightVector,
            ambient,
            hVector,
            specular,
            phong_exponent,
            o.mirror,
            rVector,
            shadows
          ).components
        );
      } else {
        setPixel(i, j, BLACK.components);
      }
    }
  }

  // display image on canvas element
  ctx.putImageData(imageData, 0, 0);
}
