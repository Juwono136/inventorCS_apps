import React from "react";
import { Typography } from "@material-tailwind/react";
import TeamCard from "./TeamCard";

const members = [
  {
    img: `https://www.material-tailwind.com/img/avatar1.jpg`,
    name: "Ryan Samuel",
    title: "Co-Founder",
  },
  {
    img: `https://www.material-tailwind.com/img/avatar2.jpg`,
    name: "Ryan Samuel",
    title: "Co-Founder",
  },
  {
    img: `https://www.material-tailwind.com/img/avatar5.jpg`,
    name: "Nora Hazel",
    title: "UI/UX Designer",
  },
  {
    img: `https://www.material-tailwind.com/img/avatar4.jpg`,
    name: "Otto Gonzalez",
    title: "Marketing Specialist",
  },
  {
    img: `https://www.material-tailwind.com/img/avatar6.jpg`,
    name: "Emma Roberts",
    title: "UI Designer",
  },
  {
    img: `https://www.material-tailwind.com/img/avatar3.jpg`,
    name: "William Pearce",
    title: "Web Developer",
  },
  {
    img: "https://www.material-tailwind.com/image/avatar7.svg",
    name: "Bruce Mars",
    title: "UI/UX Designer",
  },
  {
    img: "https://www.material-tailwind.com/image/avatar8.svg",
    name: "Annie Sprrat",
    title: "Marketing Specialist",
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
            Computer Science Program - BIU
          </Typography>
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
            <TeamCard key={key} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamComponent;
