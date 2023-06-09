import { useEffect } from 'react';
import { GUI } from 'dat.gui';
import * as THREE from 'three';

import SceneInit from './lib/SceneInit';
import exportPlanetDict from './assets/planetDict.js';
import { Quaternion, Vector3 } from 'three';

const scalerLength = Math.pow(10,7);
const scalerRadius = Math.pow(10,5);
const uniScaler = Math.pow(10,4);

function App() {
  useEffect(() => {
    const test = new SceneInit('myThreeJsCanvas');
    test.initialize();
    test.animate();

    // Axes for object space
    const axesHelper = new THREE.AxesHelper(8000);
    test.scene.add(axesHelper);


    // Dat.Gui to debug Values and objects
    const gui = new GUI();

    const planets = ["mecury", "venus", "earth", "mars", "jupyter", "saturn", "uranus", "neptun", "pluto"];
    const planetMesh = [];
    const planetDict = exportPlanetDict;
    console.log(Object.keys(planetDict).length);

    /*
    Creates a sphere with geometry input, material input and its initial coordinates X,Y,Z
    */
    function createPlanet(geometryInput, matInput, initialX, initialY, initialZ){
      const sphereGeometry = new THREE.SphereGeometry(geometryInput);
      const sphereMaterial = new THREE.MeshNormalMaterial(matInput);
      const sphereMesh =  new THREE.Mesh(sphereGeometry, sphereMaterial);
      sphereMesh.position.x = initialX;
      sphereMesh.position.y = initialY;
      sphereMesh.position.z = initialZ;
      sphereMesh.rotation.x = 0.5;
      return sphereMesh;
    }

    function createCurve(semiMajorAxis, semiMinorAxis, aphelion, argOfPerhelion, inclination,loan){
      const curveGeometry = new THREE.EllipseCurve(
        0, 0,     // ax, aY
        semiMajorAxis, semiMinorAxis,    // xRadius, yRadius
        0,  2 * Math.PI,    // aStartAngle, aEndAngle
        true,      // aClockwise
        0,         // aRotation
      );
      let line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(curveGeometry.getSpacedPoints(100)), new THREE.LineBasicMaterial({
        color: "yellow"
      }));
      const d = semiMajorAxis - aphelion;
      // line.rotateOnAxis(new THREE.Vector3(1,0,0),inclination * Math.PI / 180);
      // line.rotateOnAxis(new THREE.Vector3(0,1,0),loan * Math.PI / 180);
      // line.rotateOnAxis(new THREE.Vector3(0,0,1),argOfPerhelion * Math.PI / 180);
      line.rotation.x = inclination * Math.PI / 180;
      line.rotation.y = loan * Math.PI / 180;
      line.rotation.z = argOfPerhelion * Math.PI / 180;
      // // // // // line.rotation.x = 0.5*Math.PI + (loan/360)*Math.PI;
      // // // // // line.rotation.y = (inclination/360)*Math.PI;
      // // // // // line.rotation.z = 0;
      line.position.x = d * Math.cos(inclination * Math.PI / 180) * Math.cos(argOfPerhelion * Math.PI / 180) - d * Math.sin(loan * Math.PI / 180) * Math.cos(loan * Math.PI / 180) * Math.sin(argOfPerhelion * Math.PI / 180);
      line.position.y = d * Math.sin(inclination * Math.PI / 180) * Math.cos(argOfPerhelion * Math.PI / 180) + d * Math.cos(loan * Math.PI / 180) * Math.cos(loan * Math.PI / 180) * Math.sin(argOfPerhelion * Math.PI / 180);
      line.position.z = d * Math.sin(loan * Math.PI / 180) * Math.sin(argOfPerhelion * Math.PI / 180) + d * Math.cos(loan * Math.PI / 180) * Math.cos(argOfPerhelion * Math.PI / 180);
      return line;
    }

      for (let i = 0; i < Object.keys(planetDict).length; i++){
        if(planetDict[i]["name"] === "Sun"){
          planetDict[i]["Ellipse"] = createCurve(planetDict[i]["semiMajorAxis"]/scalerLength,planetDict[i]["semiMinorAxis"]/scalerLength,planetDict[i]["aphelion"]/scalerLength,planetDict[i]["argOfPerihelion"],planetDict[i]["inclination"],planetDict[i]["LOAN"]);
          test.scene.add(planetDict[i]["Ellipse"]);
        }
        else if(planetDict[i]["name"] === "Moon"){
          planetDict[i]["Ellipse"] = createCurve(planetDict[i]["semiMajorAxis"]/scalerLength,planetDict[i]["semiMinorAxis"]/scalerLength,planetDict[i]["aphelion"]/scalerLength,planetDict[i]["argOfPerihelion"],planetDict[i]["inclination"],planetDict[i]["LOAN"]);
        }
        else{
          planetDict[i]["Ellipse"] = createCurve(planetDict[i]["semiMajorAxis"]/scalerLength,planetDict[i]["semiMinorAxis"]/scalerLength,planetDict[i]["aphelion"]/scalerLength,planetDict[i]["argOfPerihelion"],planetDict[i]["inclination"],planetDict[i]["LOAN"]);
          test.scene.add(planetDict[i]["Ellipse"]);
        }
      }

      for (let i = 0; i < Object.keys(planetDict).length; i++){
        if(planetDict[i]["name"] === "Sun"){
          planetDict[i]["Mesh"] = createPlanet(planetDict[i]["meanRadius"]/(scalerRadius*2.5), {wireframe: true}, planetDict[i]["aphelion"]/scalerLength, 0, 0);
          test.scene.add(planetDict[i]["Mesh"]);
        }
        else if(planetDict[i]["name"] === "Moon"){
          planetDict[i]["Mesh"] = createPlanet(planetDict[i]["meanRadius"]/scalerRadius, {wireframe: true}, planetDict[i]["aphelion"]/scalerLength, 0, 0);
        }
        else{
          planetDict[i]["Mesh"] = createPlanet(planetDict[i]["meanRadius"]/scalerRadius, {wireframe: true}, planetDict[i]["aphelion"]/scalerLength, 0, 0);
          test.scene.add(planetDict[i]["Mesh"]);
        }
      // if(planetDict[i]["name"] === "Sun"){
      //   planetDict[i]["Mesh"] = createPlanet(planetDict[i]["meanRadius"]/uniScaler, {wireframe: true}, planetDict[i]["perihelion"]/uniScaler, 0, 0);
      //   test.scene.add(planetDict[i]["Mesh"]);
      // }
      // else if(planetDict[i]["name"] === "Moon"){
      //   planetDict[i]["Mesh"] = createPlanet(planetDict[i]["meanRadius"]/uniScaler, {wireframe: true}, planetDict[i]["perihelion"]/uniScaler, 0, 0);
      // }
      // else{
      //   planetDict[i]["Mesh"] = createPlanet(planetDict[i]["meanRadius"]/uniScaler, {wireframe: true}, planetDict[i]["perihelion"]/uniScaler, 0, 0);
      //   test.scene.add(planetDict[i]["Mesh"]);
      // }

    }



    // const ellipseGeometry = new THREE.ellipseGeometry(0, 0, 10, 5);
    // const ellipseMaterial = new THREE.ellipseMaterial({wireframe: true});
    // const ellipseMesh = new THREE.Mesh(ellipseGeometry, ellipseMaterial);
    // test.scene.add(ellipseMesh);




    let curve = new THREE.EllipseCurve(
      0, 0,     // ax, aY
      10, 14,    // xRadius, yRadius
      0,  2 * Math.PI,    // aStartAngle, aEndAngle
      true,    // aClockwise
	    0,         // aRotation
      );
    let line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getSpacedPoints(100)), new THREE.LineBasicMaterial({
      color: "red"
    }));
    line.rotation.x = 0;
    line.rotation.y = 0;
    line.rotation.z = 0;
    line.quaternion.x = 0;
    line.quaternion.y = 0;
    line.quaternion.z = 0;
    line.rotateX(0*Math.PI);
    line.rotateY(0.3*Math.PI);
    line.rotateZ(0.3*Math.PI);
    test.scene.add(line);
    gui.add(line.quaternion,"x",0, 2*Math.PI).name("quaternion X");
    gui.add(line.quaternion,"y",0, 2*Math.PI).name("quaternion Y");
    gui.add(line.quaternion,"z",0, 2*Math.PI).name("quaternion Z");
    gui.add(line.rotation,"x",0, 2*Math.PI).name("Rotation X");
    gui.add(line.rotation,"y",0, 2*Math.PI).name("Rotation Y");
    gui.add(line.rotation,"z",0, 2*Math.PI).name("Rotation Z");


    const animate = () => {
      for (let i = 0; i < Object.keys(planetDict).length; i++){
        planetDict[i]["Mesh"].rotation.y -= 0.01;
      }
      window.requestAnimationFrame(animate);
    };
    animate();
    return () => {
      gui.destroy();
    };
  });
  return (
    <div>
      <canvas id="myThreeJsCanvas" />
    </div>
  );
}

export default App;
