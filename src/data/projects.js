// Optional `content` sets the boxes in order, replacing descriptionLong and img:
// content: [{ title?, text?, images?: [{ src, alt, caption? }], columns?, side?: "left" | "right" }, ...]
// `side` puts the images beside the text (images on that side) instead of below it.
export const projects = [
  {
    id: "like-insects",
    title: "Like Insects",
    descriptionShort:
      "Insect-inspired fashion collection with integrated technology.",
    content: [
      {
        side: "left",
        images: [
          {
            src: "/img/projects/like_insects_4.jpg",
            alt: "GLOW 2026 exhibition",
            caption: "GLOW 2026 exhibition",
          },
        ],
        columns: 1,
        text: "A collection of seven fashion looks inspired by insect shapes and movements, created in collaboration with Summa Fashion and FashionTech designer [Anouk Wipprecht](https://www.anoukwipprecht.nl/).\n\nI contributed to the third iteration of development, which focused on adding interactive features, upgrading the power supply, and making the electronics reliable for exhibitions and events.",
      },
      {
        images: [
          {
            src: "/img/projects/like_insects_3.jpeg",
            alt: "Dutch Design Week 2026 exhibition",
            caption: "Dutch Design Week 2026 exhibition",
          },
          {
            src: "/img/projects/like_insects_2.jpg",
            alt: "GLOW 2026 exhibition",
            caption: "GLOW 2026 exhibition",
          },
        ],
        columns: 2,
      },
      {
        side: "right",
        images: [
          {
            src: "/img/projects/like_insects_5.jpg",
            alt: "GLOW 2026 exhibition",
            caption: "GLOW 2026 exhibition",
          },
        ],
        columns: 1,
        text: "The project was showcased at [Dutch Design Week](https://ddw.nl/en/programme/archive/2025/fashion-tech-like-insects) and [GLOW Eindhoven 2026](https://gloweindhoven.nl/project/like-insects-summa-fashion-fontys-technology-anouk-wipprecht/).\n\nFor DDW, distance sensors triggered servos to move butterfly and dragonfly wings as people approached. For GLOW, a camera detected visitors stepping onto a spot to start a show with lighting and mechanical flowers that bloomed in response.",
      },
      {
        images: [
          {
            src: "/img/projects/like_insects_7.jpg",
            alt: "Photoshoot picture",
            caption: "The entire collection together",
          },
        ],
        columns: 1,
      },
    ],
    type: "School Project",
  },
  {
    id: "esphome-wled-controller",
    title: "ESPHome WLED Controller",
    descriptionShort: "Control panel for WLED through Home Assistant.",
    content: [
      {
        side: "right",
        images: [
          {
            src: "/img/projects/esphome_wled_controller_1.jpg",
            alt: "ESPHome WLED Controller",
          },
        ],
        columns: 1,
        text: "A control panel built to manage WLED lighting setups through Home Assistant. It replaces annoying mobile apps and extra remotes with a solid interface. It features a rotary encoder for power and brightness, along with a joystick to navigate through custom lighting presets. Everything is displayed on a small LCD screen, and housed inside a 3D-printed enclosure.",
      },
      {
        side: "left",
        images: [
          {
            src: "/img/projects/esphome_wled_controller_2.jpg",
            alt: "ESPHome WLED Controller",
          },
        ],
        columns: 1,
        text: "Built on an ESP32 running ESPHome firmware, the controller communicates directly with Home Assistant over the local network. It is separate from the main actual LED strip WLED board, so it can be placed in the most convenient location.",
      },
    ],
    type: "Personal Project",
    skills: [
      { icon: "/img/skill-icons/esp32.svg", alt: "ESP32" },
      { icon: "/img/skill-icons/home-assistant.svg", alt: "Home Assistant" },
      { icon: "/img/skill-icons/fusion.svg", alt: "Autodesk Fusion" },
    ],
    repoUrl: "https://github.com/verbabke/esphome-wled-controller",
  },
  {
    id: "pod-data",
    title: "Pod Data",
    descriptionShort: "Completion tracker webapp for NieR: Automata.",
    content: [
      {
        side: "left",
        images: [{ src: "/img/projects/poddata_2.png", alt: "Website mockup" }],
        columns: 1,
        text: "A web-based checklist for tracking completion progress in NieR: Automata. Users can check off quests, endings, achievements, and more to keep track of their progress toward 100% completion. To save time, users can import their actual game save file, which gets parsed in the browser to automatically update their checklist.\n\nBuilt with Nuxt, Vuetify, and Supabase, with a visual design inspired by the in-game UI.",
      },
    ],
    type: "Personal Project",
    skills: [
      { icon: "/img/skill-icons/nuxt.svg", alt: "Nuxt" },
      { icon: "/img/skill-icons/vuetify.svg", alt: "Vuetify" },
      { icon: "/img/skill-icons/supabase.svg", alt: "Supabase" },
    ],
    liveUrl: "https://www.poddata.net/",
    repoUrl: "https://github.com/verbabke/pod-data",
  },
  {
    id: "unbubble",
    title: "Unbubble",
    descriptionShort: "A public installation for engaging with daily prompts.",
    content: [
      {
        side: "left",
        images: [
          {
            src: "/img/projects/unbubble_1.png",
            alt: "Advertising screen mockup",
          },
        ],
        columns: 1,
        text: "This is a public installation that invites visitors to engage with daily rotating prompts by popping bubbles. Popping a bubble reveals a response from a previous participant, encouraging visitors to share their own insights, creating a dialogue around the daily theme.\n\nI was involved in the concepting, design, development, and testing of the project.",
      },
    ],
    type: "School Client Project",
    skills: [
      { icon: "/img/skill-icons/react.svg", alt: "React" },
      { icon: "/img/skill-icons/threejs.svg", alt: "Three.js" },
      { icon: "/img/skill-icons/tailwind.svg", alt: "Tailwind" },
    ],
  },
  {
    id: "het-hornemann-huis",
    title: "Het Hornemann Huis",
    descriptionShort:
      "Choose-your-own-adventure video experience for WW2 museum Het Hornemann Huis.",
    content: [
      {
        side: "left",
        images: [
          {
            src: "/img/projects/hornemann_2.png",
            alt: "Auditorium screen mockup",
          },
        ],
        columns: 1,
        text: "This is a choose-your-own-adventure video experience for WW2 Holocaust museum [Het Hornemann Huis](https://hethornemannhuis.nl/), with the goal of making users think about the various dilemmas people had to go through during the war. Viewers are able to make choices that influence the storyline by casting a vote on what actions to take.",
      },
      {
        images: [
          {
            src: "/img/projects/hornemann_1.png",
            alt: "Auditorium screen mockup",
          },
          { src: "/img/projects/hornemann_3.png", alt: "Phone screen mockup" },
        ],
      },
    ],
    type: "School Client Project",
    skills: [
      { icon: "/img/skill-icons/js.svg", alt: "JavaScript" },
      { icon: "/img/skill-icons/node.svg", alt: "Node.js" },
    ],
    liveUrl: "https://hornemann.onrender.com/videoscreen.html",
  },
  // {
  //   id: "compass",
  //   title: "Compass",
  //   descriptionShort: 'Website for a "create-your-own media studio" project.',
  //   descriptionLong:
  //     'Compass is a website designed and developed for a "create-your-own media studio" project. The goal was to create a unique visual identity. This was done through various storytelling techniques and theming around the client being lost at sea, and the "Compass" being a guiding tool for their journey. I was responsible for the visuals, design, and development of the website.',
  //   type: "School Project",
  //   img: [{ src: "/img/projects/compass_1.png", alt: "Desktop screen mockup" }],
  //   skills: [
  //     { icon: "/img/skill-icons/html.svg", alt: "HTML" },
  //     { icon: "/img/skill-icons/css.svg", alt: "CSS" },
  //   ],
  //   liveUrl: "https://compass-pink-eta.vercel.app/",
  // },
  {
    id: "3d-os",
    title: "3D OS",
    descriptionShort:
      "3D environment with a monitor and replicated operating system.",
    content: [
      {
        side: "left",
        images: [
          { src: "/img/projects/monitor_1.png", alt: "3D environment monitor" },
        ],
        columns: 1,
        text: "This is a 3D environment that simulates a desktop experience with a monitor and a replicated operating system. At the time, I used it to showcase my work for the semester of my studies inside of the internet explorer window. \n\nThe project was built using React, React Three Fiber, and Drei. The 3D model was created in Blender.",
      },
      {
        images: [
          {
            src: "/img/projects/monitor_2.png",
            alt: "3D environment monitor",
          },
          { src: "/img/projects/monitor_3.png", alt: "3D environment monitor" },
        ],
      },
    ],
    type: "School Project",
    skills: [
      { icon: "/img/skill-icons/react.svg", alt: "React" },
      { icon: "/img/skill-icons/threejs.svg", alt: "Three.js" },
      { icon: "/img/skill-icons/blender.svg", alt: "Blender" },
    ],
    liveUrl: "https://3d-monitor-lyart.vercel.app/",
  },
];
