import * as THREE from "three";
import * as RAPIER from "@dimforge/rapier3d-compat";
import { useEffect, useRef, useState } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { CapsuleCollider, RigidBody, useRapier } from "@react-three/rapier";
import Axe from "../Axe";
import create from "zustand";

import { useCubeStore } from "../Cube";
import { useInstanceStore } from "../Terrain";

import { useMutation } from "@apollo/client";
import { ADD_BUILD } from "../../utils/mutations";

let SPEED = 6;
const direction = new THREE.Vector3();
const frontVector = new THREE.Vector3();
const sideVector = new THREE.Vector3();
const rotation = new THREE.Vector3();

let objMem = "";
let saveMem = false;

export const useSelectedStore = create((set) => ({
  selected: "",
  lookAt: false,
  setSelected: (option) => set((state) => ({ selected: option })),
  setLookAt: (look) => set((state) => ({ lookAt: look })),
}));

export function Player({ lerp = THREE.MathUtils.lerp }) {
  const [addBuild] = useMutation(ADD_BUILD);

  const axe = useRef();
  const ref = useRef();
  const rapier = useRapier();
  const { camera, scene } = useThree();
  const [, get] = useKeyboardControls();
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  const [saveButton, setSaveButton] = useState(false);

  const setSelected = useSelectedStore((state) => state.setSelected);
  const setLookAt = useSelectedStore((state) => state.setLookAt);
  const cubes = useCubeStore((state) => state.cubes);
  const instanceBlocks = useInstanceStore((state) => state.positions);

  useEffect(() => {
    const setDB = async (data) => {
      try {
        await addBuild({
          variables: { buildData: data },
        });
      } catch (e) {
        console.error(e);
      }
    };

    if (saveButton) {
      const modal = document.querySelector(".save-modal");
      modal.classList.remove("fade-out");
      modal.classList.add("fade-in");

      setTimeout(() => {
        modal.classList.remove("fade-in");
        modal.classList.add("fade-out");
      }, 1500);
      const pkg = { cubes: cubes, instanceBlocks: instanceBlocks };
      const data = JSON.stringify(pkg);

      setDB(data);
    }
  }, [saveButton]);

  useFrame((state) => {
    let {
      forward,
      backward,
      left,
      right,
      jump,
      hotbar1,
      hotbar2,
      hotbar3,
      hotbar4,
      hotbar5,
      hotbar6,
      hotbar7,
      hotbar8,
      hotbar9,
      save,
      shift,
    } = get();

    // Shift speed modifier
    if (shift) {
      SPEED = 3;
    } else {
      SPEED = 6;
    }

    if (save && saveMem !== save) {
      setSaveButton(true);
      saveMem = true;
    } else if (!save) {
      setSaveButton(false);
      saveMem = false;
    }

    const velocity = ref.current.linvel();
    const { x, y, z } = ref.current.translation();

    // Catch player falls
    if (y < -30) {
      ref.current.setTranslation({ x: 10, y: 20, z: 10 });
    }

    // Hotbar cycling
    if (hotbar1) setSelected("1");
    else if (hotbar2) setSelected("2");
    else if (hotbar3) setSelected("3");
    else if (hotbar4) setSelected("4");
    else if (hotbar5) setSelected("5");
    else if (hotbar6) setSelected("6");
    else if (hotbar7) setSelected("7");
    else if (hotbar8) setSelected("8");
    else if (hotbar9) setSelected("9");

    // Potentially convert radians to degrees and then decide what to do from there
    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(SPEED)
      .applyEuler(camera.rotation);

    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects(scene.children);
    if (intersects.length) {
      const camPos = camera.position;
      const intersectPos = intersects[0].object.position;

      const xDist = Math.pow(camPos.x - intersectPos.x, 2);
      const yDist = Math.pow(camPos.y - intersectPos.y, 2);
      const zDist = Math.pow(camPos.z - intersectPos.z, 2);

      const dist = Math.sqrt(xDist + yDist + zDist);

      if (
        intersects[0].object.name === "Terrain" &&
        intersects[0].object.id !== objMem.id &&
        dist < 7
      ) {
        if (objMem !== "") {
          if (objMem.selected === true) objMem.selected = false;
          setLookAt(false);
          objMem.color = new THREE.Color(1, 1, 1);
        }

        objMem = intersects[0].object;
        intersects[0].object.selected = true;
        setLookAt(true);
        const color = intersects[0].object.color;
        if (color !== undefined) {
          color["r"] = 3;
          color["b"] = 0;
          color["g"] = 0;
        }
      }

      if (intersects[0].object.id !== objMem.id || dist > 7) {
        if (objMem !== "") {
          setLookAt(false);
          objMem.selected = false;
          const oldColor = objMem.color;

          if (oldColor !== undefined) {
            oldColor["r"] = 1;
            oldColor["b"] = 1;
            oldColor["g"] = 1;
          }
          objMem = "";
        }
      }
    }

    // update camera
    camera.position.set(...[x, y + 0.8, z]);

    // update axe
    axe.current.children[0].rotation.x = lerp(
      axe.current.children[0].rotation.x,
      Math.sin((velocity.length() > 1) * state.clock.elapsedTime * 10) / 6,
      0.1
    );

    axe.current.rotation.copy(camera.rotation);
    axe.current.position
      .copy(camera.position)
      .add(camera.getWorldDirection(rotation).multiplyScalar(1));

    // movement

    frontVector.set(0, 0, backward - forward);
    sideVector.set(left - right, 0, 0);

    ref.current.setLinvel({
      x: direction.x,
      y: velocity.y,
      z: direction.z,
    });

    // jumping
    const world = rapier.world.raw();
    const ray = world.castRay(
      new RAPIER.Ray(ref.current.translation(), { x: 0, y: -1, z: 0 })
    );
    const grounded = ray && ray.collider && Math.abs(ray.toi) <= 1;
    if (jump && grounded) ref.current.setLinvel({ x: 0, y: 8, z: 0 });
  });

  return (
    <>
      <RigidBody
        ref={ref}
        colliders={false}
        mass={1}
        type="dynamic"
        position={[10, 20, 10]}
        enabledRotations={[false, false, false]}
      >
        <CapsuleCollider args={[0.3, 0.3]} />
      </RigidBody>
      <group
        ref={axe}
        onPointerMissed={(e) => (axe.current.children[0].rotation.x = -0.5)}
      >
        <Axe position={[0.3, -0.35, 0.5]} />
      </group>
    </>
  );
}
