import React from "react";
import { Canvas, useThree } from "@react-three/fiber";
import {
  Sky,
  Stars,
  softShadows,
  PointerLockControls,
  KeyboardControls,
  Loader,
  Preload,
  BakeShadows,
  PerformanceMonitor,
} from "@react-three/drei";
import { Physics, Debug } from "@react-three/rapier";
import { Cubes, Cube } from "../Components/Cube";
import { Ground } from "../Components/Ground";
import { Player } from "../Components/Player";
import { Terrain } from "../Components/Terrain";

import { Suspense, useState } from "react";

import { useControls, button, Leva } from "leva";
import { useQuery, useMutation } from "@apollo/client";
import { QUERY_USER, QUERY_ME } from "../utils/queries";
import { Navigate, useParams } from "react-router-dom";
import Auth from "../utils/auth";

export default function Editor() {
  const [dpr, setDpr] = useState(1.5);
  return (
    <KeyboardControls
      map={[
        { name: "forward", keys: ["ArrowUp", "w", "W"] },
        { name: "backward", keys: ["ArrowDown", "s", "S"] },
        { name: "left", keys: ["ArrowLeft", "a", "A"] },
        { name: "right", keys: ["ArrowRight", "d", "D"] },
        { name: "jump", keys: ["Space"] },
        { name: "hotbar1", keys: ["1"] },
        { name: "hotbar2", keys: ["2"] },
        { name: "hotbar3", keys: ["3"] },
        { name: "hotbar4", keys: ["4"] },
        { name: "hotbar5", keys: ["5"] },
        { name: "hotbar6", keys: ["6"] },
        { name: "hotbar7", keys: ["7"] },
        { name: "hotbar8", keys: ["8"] },
        { name: "hotbar9", keys: ["9"] },
      ]}
    >
      <Canvas shadows camera={{ fov: 45 }}>
        <PerformanceMonitor
          onIncline={() => setDpr(2)}
          onDecline={() => setDpr(1)}
        >
          <Preload all />
          <Suspense>
            <BakeShadows />
            <Sky
              elevation={0.6}
              rayleigh={1.558}
              azimuth={14.7}
              exposure={0.4349}
              sunPosition={[100, 10, 100]}
              turbidity={3.1}
            />
            {/* <Stars
						radius={100}
						depth={50}
						count={5000}
						factor={4}
						saturation={0}
						fade
						speed={1}
					/> */}


	const { username: userParam } = useParams();

	const { loading, data } = useQuery(userParam ? QUERY_USER : QUERY_ME, {
		variables: { username: userParam },
	});

	const user = data?.me || data?.user || {};

	if (Auth.loggedIn() && Auth.getProfile().data.username === userParam) {
		return <Navigate to='/Editor' />;
	}

	if (loading) {
		return <div className="text-gray-300 text-lg">Loading...</div>;
	}

	if (!user?.username) {
		return (
			<h3 className="btn-minecraft flex flex-col items-center m-auto animate-pulse">
				You need to be logged in to see this page. Please log in or sign up!
			</h3>
		);
	}

	softShadows();

	return (
		<KeyboardControls
			map={[
				{ name: "forward", keys: ["ArrowUp", "w", "W"] },
				{ name: "backward", keys: ["ArrowDown", "s", "S"] },
				{ name: "left", keys: ["ArrowLeft", "a", "A"] },
				{ name: "right", keys: ["ArrowRight", "d", "D"] },
				{ name: "jump", keys: ["Space"] },
			]}
		>
			<div 
				style={{
					top: 16,
					right: 130,
					position: "absolute",
					width: "auto",
				}}
				className=".btn-minecraft"
			>
			<Leva 
				flat={{
					flat: 'true'
				}}
				titleBar={false}
				fill={true}
			/>
			</div>
			<Canvas gl={{ preserveDrawingBuffer: true }} shadows camera={{ fov: 45 }}>
				<Preload all />
				<Scene />
				<BakeShadows />
				<Sky
					elevation={0.6}
					rayleigh={1.558}
					azimuth={14.7}
					exposure={0.4349}
					sunPosition={[100, 10, 100]}
					turbidity={3.1}
				/>


            <ambientLight intensity={0.3} />
            <pointLight castShadow intensity={0.8} position={[100, 100, 100]} />
            <Physics gravity={[0, 0, 0]}>
              <Terrain />
              <Player />
              <Cube />
              <Cubes />
            </Physics>
            <PointerLockControls />
          </Suspense>
        </PerformanceMonitor>
      </Canvas>
      <Loader initialState={(active) => active} />
    </KeyboardControls>
  );

}

function Scene() {
  const gl = useThree((state) => state.gl);
  useControls({
    screenshot: button(() => {
      const link = document.createElement("a");
      link.setAttribute("download", "Saved.png");
      link.setAttribute(
        "href",
        gl.domElement
          .toDataURL("image/png")
          .replace("image/png", "image/octet-stream")
      );
      link.click();
    }),
  });
  return <>{/* We are using this space to fill the return statement. */}</>;
}
