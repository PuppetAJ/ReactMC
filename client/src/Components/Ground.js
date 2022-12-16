import * as THREE from "three";
import { useTexture } from "@react-three/drei";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import grass from "../assets/grass.jpg";

export function Ground(props) {
	const texture = useTexture(grass);
	texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
	return (
		<RigidBody {...props} type="fixed" colliders="cuboid">
			<mesh receiveShadow position={[0, 0, 0]} rotation-x={-Math.PI / 2}>
				<planeGeometry args={[50, 50]} />
				<meshStandardMaterial
					map={texture}
					map-repeat={[240, 240]}
					color="green"
				/>
			</mesh>
			{/* <CuboidCollider args={[10, 2, 10]} position={[0, -2, 0]} /> */}
		</RigidBody>
	);
}
