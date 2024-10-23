import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import type { Container } from "@tsparticles/engine";
// import { loadAll } from "@tsparticles/all"; // if you are going to use `loadAll`, install the "@tsparticles/all" package too.
// import { loadFull } from "tsparticles"; // if you are going to use `loadFull`, install the "tsparticles" package too.
import { loadSlim } from "@tsparticles/slim"; // if you are going to use `loadSlim`, install the "@tsparticles/slim" package too.
// import { loadBasic } from "@tsparticles/basic"; // if you are going to use `loadBasic`, install the "@tsparticles/basic" package too.

export const ParticlesComponent = () => {
  const [init, setInit] = useState(false);

  // this should be run only once per application lifetime
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
      // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
      // starting from v2 you can add only the features you need reducing the bundle size
      //await loadAll(engine);
      //await loadFull(engine);
      await loadSlim(engine);
      //await loadBasic(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = async (container?: Container): Promise<void> => {
    if (container) {
      console.log("Particles loaded", container);
    } else {
      console.error("Particles failed to load");
    }
  };

  if (init) {
    return (
      <div className="z-20">
        <Particles
          id="tsparticles"
          url="/assets/particles/fire.json"
          particlesLoaded={particlesLoaded}
        />
        {/* <Particles
  id="tsparticles"
  particlesLoaded={particlesLoaded}
  options={{
    particles: {
      number: { value: 50 },
      color: { value: "#ffffff" },
      size: { value: 3 },
      move: { enable: true, speed: 1 }
    }
  }}
  style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 1 }}
/> */}
      </div>
    );
  }
  return <></>;
};
