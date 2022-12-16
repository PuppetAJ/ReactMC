import React from "react";
import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { Noise } from "noisejs";
import { RigidBody } from "@react-three/rapier";
import { useTexture, Edges } from "@react-three/drei";
import create from "zustand";
import grass from "../assets/grass.jpg";

export function Ground2() {
	const texture = useTexture(grass);
	const [blocks, setBlocks] = useState([]);
	// const ref = useRef();
	useEffect(() => {
		// console.log(Noise);
		const noise = new Noise(Math.random());
		let blockStore = [];
		// let xOff = 0;
		// let zOff = 0;
		let inc = 0.05;
		let amplitude = 30;
		// let xOff = 0;
		// let zOff = 0;
		// let x = 0;
		// while (x < 60) {
		// 	xOff = 0;
		// 	let z = 0;
		// 	while (z < 60) {
		// 		let y = Math.round((noise.perlin2(xOff, zOff) * amplitude) / 5) + 2;
		// 		blockStore.push([x, y, z]);
		// 		xOff = xOff + inc;
		// 		z++;
		// 	}
		// 	zOff = zOff + inc;
		// 	x++;
		// }
		// let xOff = 0;
		// let zOff = 0;
		// for (let x = 0; x < 60; x++) {
		// 	xOff = 0;
		// 	let y = Math.round((noise.perlin2(xOff, zOff) * amplitude) / 5) + 2;
		// 	for (let z = 0; z < 60; z++) {
		// 		blockStore.push([x, y, z]);
		// 		xOff = xOff + inc;
		// 	}
		// 	zOff = zOff + inc;
		// }
		// const blockStore = [];
		let xOff = 0;
		let zOff = 0;
		for (let x = 0; x < 40; x++) {
			xOff = 0;
			for (let z = 0; z < 40; z++) {
				const y = Math.round((noise.perlin2(xOff, zOff) * amplitude) / 5) + 2;
				blockStore.push([x, y, z]);
				xOff = xOff + inc;
			}
			zOff = zOff + inc;
		}

		setBlocks(blockStore);
	}, []);

	return (
		<>
			{blocks.map(([x, y, z], i) => (
				<RigidBody position={[x, y, z]} key={i} type="fixed" colliders="cuboid">
					<mesh position={[0, 0, 0]} receiveShadow castShadow>
						<Edges />
						<meshBasicMaterial color={0x777aaa} />
						<boxGeometry args={[1, 1, 1]} />
					</mesh>
				</RigidBody>
			))}
		</>
	);
}
