import { tsParticles } from "@tsparticles/engine";
import { useEffect } from "react";
import { loadFull } from "tsparticles";

const ParticlesComponentLose = () => {
  useEffect(() => {
    async function loadParticles(options: any) {
      await loadFull(tsParticles);
      await tsParticles.load({ id: "tsparticles", options });
    }

    const emitterRate = {
      delay: 0.8,
      quantity: 1,
    };

    const options = {
      particles: {
        opacity: {
          value: 1,
        },
        size: {
          value: {
            min: 16,
            max: 32,
          },
        },
        move: {
          enable: true,
          gravity: {
            enable: true,
            acceleration: 0.4,
          },
          speed: 6,
          outModes: {
            default: "destroy",
            top: "none",
          },
        },
        rotate: {
          value: {
            min: 0,
            max: 90,
          },
          direction: "random",
          move: true,
          animation: {
            enable: true,
            speed: 30,
          },
        },
        tilt: {
          direction: "random",
          enable: true,
          move: true,
          value: {
            min: 0,
            max: 360,
          },
          animation: {
            enable: true,
            speed: 20,
          },
        },
        // roll: {
        //   darken: {
        //     enable: true,
        //     value: 30,
        //   },
        //   enlighten: {
        //     enable: true,
        //     value: 30,
        //   },
        //   enable: true,
        //   mode: "both",
        //   speed: {
        //     min: 15,
        //     max: 25,
        //   },
        // },
        // wobble: {
        //   distance: 30,
        //   enable: true,
        //   move: true,
        //   speed: {
        //     min: -15,
        //     max: 15,
        //   },
        // },
      },
      background: {
        color: "#",
      },
      emitters: [
        {
          position: { x: 0, y: 33 },
          rate: emitterRate,
          particles: {
            move: { direction: "top-right" },
            shape: {
              type: "circle", // Change shape to "circle"
            },
          },
        },
        {
          position: { x: 0, y: 66 },
          rate: emitterRate,
          particles: {
            move: { direction: "top-right" },
            shape: {
              type: "circle", // Change shape to "circle"
            },
          },
        },
        {
          position: { x: 100, y: 33 },
          rate: emitterRate,
          particles: {
            move: { direction: "top-left" },
            shape: {
              type: "circle", // Change shape to "circle"
            },
          },
        },
        {
          position: { x: 100, y: 66 },
          rate: emitterRate,
          particles: {
            move: { direction: "top-left" },
            shape: {
              type: "circle", // Change shape to "circle"
            },
          },
        },
      ],
    };

    loadParticles(options);

    // Cleanup particles when component unmounts
    return () => {
      tsParticles
        .dom()
        .forEach((particlesInstance) => particlesInstance.destroy());
    };
  }, []); // Empty dependency array ensures this runs only once

  return <div id="tsparticles"></div>;
};

export default ParticlesComponentLose;
