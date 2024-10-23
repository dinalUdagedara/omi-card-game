import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import {
  type Container,
  type ISourceOptions,
  MoveDirection,
  OutMode,
} from "@tsparticles/engine";
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

  const emitterRate = {
    delay: 0.1,
    quantity: 2,
  };

  const options2: ISourceOptions = useMemo(
    () => ({
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
        color: "#fffff",
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
    }),
    []
  );

  const options: ISourceOptions = useMemo(
    () => ({
      background: {
        color: {
          value: "#0d47a1",
        },
      },
      fpsLimit: 120,
      interactivity: {
        events: {
          onClick: {
            enable: true,
            mode: "push",
          },
          onHover: {
            enable: true,
            mode: "repulse",
          },
        },
        modes: {
          push: {
            quantity: 4,
          },
          repulse: {
            distance: 200,
            duration: 0.4,
          },
        },
      },
      particles: {
        color: {
          value: "#ffffff",
        },
        links: {
          color: "#ffffff",
          distance: 150,
          enable: true,
          opacity: 0.5,
          width: 1,
        },
        move: {
          direction: MoveDirection.none,
          enable: true,
          outModes: {
            default: OutMode.out,
          },
          random: false,
          speed: 6,
          straight: false,
        },
        number: {
          density: {
            enable: true,
          },
          value: 80,
        },
        opacity: {
          value: 0.5,
        },
        shape: {
          type: "circle",
        },
        size: {
          value: { min: 1, max: 5 },
        },
      },
      detectRetina: true,
    }),
    []
  );

  // const options = {
  //   particles: {
  //     opacity: {
  //       value: 1
  //     },
  //     size: {
  //       value: {
  //         min: 16,
  //         max: 32
  //       }
  //     },
  //     move: {
  //       enable: true,
  //       gravity: {
  //         enable: true
  //       },
  //       speed: 15,
  //       outModes: {
  //         default: "destroy",
  //         top: "none"
  //       }
  //     },
  //     rotate: {
  //       value: {
  //         min: 0,
  //         max: 360
  //       },
  //       direction: "random",
  //       move: true,
  //       animation: {
  //         enable: true,
  //         speed: 60
  //       }
  //     },
  //     tilt: {
  //       direction: "random",
  //       enable: true,
  //       move: true,
  //       value: {
  //         min: 0,
  //         max: 360
  //       },
  //       animation: {
  //         enable: true,
  //         speed: 60
  //       }
  //     },
  //     roll: {
  //       darken: {
  //         enable: true,
  //         value: 30
  //       },
  //       enlighten: {
  //         enable: true,
  //         value: 30
  //       },
  //       enable: true,
  //       mode: "both",
  //       speed: {
  //         min: 15,
  //         max: 25
  //       }
  //     },
  //     wobble: {
  //       distance: 30,
  //       enable: true,
  //       move: true,
  //       speed: {
  //         min: -15,
  //         max: 15
  //       }
  //     }
  //   },
  //   background: {
  //     color: "#ffffff"
  //   },
  //   emitters: [
  //     {
  //       position: {
  //         x: 0,
  //         y: 33
  //       },
  //       rate: emitterRate,
  //       particles: {
  //         move: {
  //           direction: "top-right"
  //         },
  //         shape: {
  //           type: "emoji",
  //           options: {
  //             emoji: {
  //               value: "♠️"
  //             }
  //           }
  //         }
  //       }
  //     },
  //     {
  //       position: {
  //         x: 0,
  //         y: 66
  //       },
  //       rate: emitterRate,
  //       particles: {
  //         move: {
  //           direction: "top-right"
  //         },
  //         shape: {
  //           type: "emoji",
  //           options: {
  //             emoji: {
  //               value: "♥️"
  //             }
  //           }
  //         }
  //       }
  //     },
  //     {
  //       position: {
  //         x: 100,
  //         y: 33
  //       },
  //       rate: emitterRate,
  //       particles: {
  //         move: {
  //           direction: "top-left"
  //         },
  //         shape: {
  //           type: "emoji",
  //           options: {
  //             emoji: {
  //               value: "♣️"
  //             }
  //           }
  //         }
  //       }
  //     },
  //     {
  //       position: {
  //         x: 100,
  //         y: 66
  //       },
  //       rate: emitterRate,
  //       particles: {
  //         move: {
  //           direction: "top-left"
  //         },
  //         shape: {
  //           type: "emoji",
  //           options: {
  //             emoji: {
  //               value: "♦️"
  //             }
  //           }
  //         }
  //       }
  //     }
  //   ]
  // };

  if (init) {
    return (
      <div className="z-20">
        {/* <Particles
          id="tsparticles"
          url="/assets/particles/fire.json"
          particlesLoaded={particlesLoaded}
        /> */}
        <Particles
          id="tsparticles"
          particlesLoaded={particlesLoaded}
          options={options2}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 20,
          }}
        />
      </div>
    );
  }
  return <></>;
};
