import React from "react";

// icons and material-tailwind
import { Typography } from "@material-tailwind/react";

// components
import TeamCardComponent from "./TeamCardComponent";

const members = [
  {
    img: `https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=Ryan`,
    name: "Ida Bagus Kerthyayana Manuaba",
    title: "Computer Science",
  },
  {
    img: `https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=Brian`,
    name: "Juwono",
    title: "Computer Science",
  },
  {
    img: `https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=Adrian`,
    name: "Wilbert Wirawan Ichwan",
    title: "Computer Science",
  },
  {
    img: `https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=Andrea`,
    name: "Brilian Yudha",
    title: "Computer Science",
  },
];

const TeamComponent = () => {
  return (
    <section className="min-h-screen py-8 px-8 lg:py-28" id="team">
      <div className="container mx-auto">
        <div className="mb-16 text-center lg:mb-28">
          <Typography variant="h6" className="text-lg text-gray-600 ">
            Meet the our team
          </Typography>
          <Typography
            variant="h1"
            color="blue-gray"
            className="my-2 !text-2xl lg:!text-4xl bg-gradient-to-r from-blue-400 via-purple-500 to-blue-800 bg-clip-text text-transparent animate-gradient"
          >
            Binus University International (BUI)
          </Typography>
          <h4 className="my-2 text-sm font-semibold bg-gradient-to-r from-indigo-400 via-purple-500 to-blue-800 bg-clip-text text-transparent animate-gradient">
            School of Computing and Creative Art (SoCCA)
          </h4>
          {/* <Typography
            variant="lead"
            className="mx-auto w-full !text-gray-500 max-w-4xl"
          >
            From visionary leadership to creative talent, and technical wizards,
            each team member plays a pivotal role in delivering the exceptional
            service and innovative solutions.
          </Typography> */}
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {members.map((props, key) => (
            <TeamCardComponent key={key} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamComponent;
