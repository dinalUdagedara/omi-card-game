// components/ParticlesComponent.tsx
import { tsParticles } from "@tsparticles/engine";
import { useEffect } from "react";

import { loadFull } from "tsparticles";

const ParticlesComponentExample = () => {
  async function loadParticles(options: any) {
    await loadFull(tsParticles);

    await tsParticles.load({ id: "tsparticles", options });
  }

  const emitterRate = {
    delay: 0.1,
    quantity: 2,
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
        },
        speed: 15,
        outModes: {
          default: "destroy",
          top: "none",
        },
      },
      rotate: {
        value: {
          min: 0,
          max: 360,
        },
        direction: "random",
        move: true,
        animation: {
          enable: true,
          speed: 60,
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
          speed: 60,
        },
      },
      roll: {
        darken: {
          enable: true,
          value: 30,
        },
        enlighten: {
          enable: true,
          value: 30,
        },
        enable: true,
        mode: "both",
        speed: {
          min: 15,
          max: 25,
        },
      },
      wobble: {
        distance: 30,
        enable: true,
        move: true,
        speed: {
          min: -15,
          max: 15,
        },
      },
    },
    background: {
      color: "#",
    },
    emitters: [
      {
        position: {
          x: 0,
          y: 33,
        },
        rate: emitterRate,
        particles: {
          move: {
            direction: "top-right",
          },
          shape: {
            type: "emoji",
            options: {
              emoji: {
                value: "♠️",
              },
            },
          },
        },
      },
      {
        position: {
          x: 0,
          y: 66,
        },
        rate: emitterRate,
        particles: {
          move: {
            direction: "top-right",
          },
          shape: {
            type: "emoji",
            options: {
              emoji: {
                value: "♥️",
              },
            },
          },
        },
      },
      {
        position: {
          x: 100,
          y: 33,
        },
        rate: emitterRate,
        particles: {
          move: {
            direction: "top-left",
          },
          shape: {
            type: "emoji",
            options: {
              emoji: {
                value: "♣️",
              },
            },
          },
        },
      },
      {
        position: {
          x: 100,
          y: 66,
        },
        rate: emitterRate,
        particles: {
          move: {
            direction: "top-left",
          },
          shape: {
            type: "emoji",
            options: {
              emoji: {
                value: "♦️",
              },
            },
          },
        },
      },
    ],
  };

  loadParticles(options);
  return <div></div>;
};

export default ParticlesComponentExample;
