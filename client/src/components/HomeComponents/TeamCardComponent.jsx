import React from "react";

// icons and material-tailwind
import { Card, CardBody, Avatar, Typography } from "@material-tailwind/react";

const TeamCardComponent = ({ img, name, title }) => {
  return (
    <Card className="rounded-lg bg-[#FAFAFA]" shadow={false}>
      <CardBody className="text-center">
        <Avatar
          src={img}
          alt={name}
          variant="circular"
          size="xxl"
          className="mx-auto mb-6 object-top"
        />
        <Typography
          variant="h5"
          className="!font-medium text-sm text-indigo-800"
        >
          {name}
        </Typography>
        <Typography
          color="blue-gray"
          className="mb-2 text-sm !font-semibold text-gray-600"
        >
          {title}
        </Typography>
        {/* <div className="flex items-center justify-center gap-1.5">
          <IconButton variant="text" color="gray">
            <i className="fa-brands fa-twitter text-lg" />
          </IconButton>
          <IconButton variant="text" color="gray">
            <i className="fa-brands fa-linkedin text-lg" />
          </IconButton>
          <IconButton variant="text" color="gray">
            <i className="fa-brands fa-dribbble text-lg" />
          </IconButton>
        </div> */}
      </CardBody>
    </Card>
  );
};

export default TeamCardComponent;
