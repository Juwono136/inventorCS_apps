import React from "react";
import product1 from "../assets/imgs/product1.jpg";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";

const OurProductSection = () => {
  return (
    <div className="flex flex-col items-center justify-center my-4">
      <div className="text-indigo-600 mb-6 text-center">
        <h1 className="text-2xl">Our Inventories</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-8 lg:grid-cols-3 xl:grid-cols-4 lg:m-6">
        <Card className="w-80">
          <CardHeader shadow={false} floated={false} className="h-96">
            <img
              src={product1}
              alt="card-image"
              className="h-full w-full object-cover"
            />
          </CardHeader>
          <CardBody>
            <div className="mb-2 flex items-center justify-between">
              <Typography color="blue-gray" className="font-semibold">
                Product 01
              </Typography>
              <Typography color="green" className="font-semibold">
                Ready
              </Typography>
            </div>
          </CardBody>
          <CardFooter className="pt-0">
            <Button
              ripple={false}
              fullWidth={true}
              className="bg-indigo-400/10 text-indigo-900 shadow-none hover:scale-105 hover:shadow-none focus:scale-105 focus:shadow-none active:scale-100"
            >
              Add to Cart
            </Button>
          </CardFooter>
        </Card>

        <Card className="w-80">
          <CardHeader shadow={false} floated={false} className="h-96">
            <img
              src={product1}
              alt="card-image"
              className="h-full w-full object-cover"
            />
          </CardHeader>
          <CardBody>
            <div className="mb-2 flex items-center justify-between">
              <Typography color="blue-gray" className="font-semibold">
                Product 01
              </Typography>
              <Typography color="green" className="font-semibold">
                Ready
              </Typography>
            </div>
          </CardBody>
          <CardFooter className="pt-0">
            <Button
              ripple={false}
              fullWidth={true}
              className="bg-indigo-400/10 text-indigo-900 shadow-none hover:scale-105 hover:shadow-none focus:scale-105 focus:shadow-none active:scale-100"
            >
              Add to Cart
            </Button>
          </CardFooter>
        </Card>

        <Card className="w-80">
          <CardHeader shadow={false} floated={false} className="h-96">
            <img
              src={product1}
              alt="card-image"
              className="h-full w-full object-cover"
            />
          </CardHeader>
          <CardBody>
            <div className="mb-2 flex items-center justify-between">
              <Typography color="blue-gray" className="font-semibold">
                Product 01
              </Typography>
              <Typography color="green" className="font-semibold">
                Ready
              </Typography>
            </div>
          </CardBody>
          <CardFooter className="pt-0">
            <Button
              ripple={false}
              fullWidth={true}
              className="bg-indigo-400/10 text-indigo-900 shadow-none hover:scale-105 hover:shadow-none focus:scale-105 focus:shadow-none active:scale-100"
            >
              Add to Cart
            </Button>
          </CardFooter>
        </Card>

        <Card className="w-80">
          <CardHeader shadow={false} floated={false} className="h-96">
            <img
              src={product1}
              alt="card-image"
              className="h-full w-full object-cover"
            />
          </CardHeader>
          <CardBody>
            <div className="mb-2 flex items-center justify-between">
              <Typography color="blue-gray" className="font-semibold">
                Product 01
              </Typography>
              <Typography color="green" className="font-semibold">
                Ready
              </Typography>
            </div>
          </CardBody>
          <CardFooter className="pt-0">
            <Button
              ripple={false}
              fullWidth={true}
              className="bg-indigo-400/10 text-indigo-900 shadow-none hover:scale-105 hover:shadow-none focus:scale-105 focus:shadow-none active:scale-100"
            >
              Add to Cart
            </Button>
          </CardFooter>
        </Card>

        <Card className="w-80">
          <CardHeader shadow={false} floated={false} className="h-96">
            <img
              src={product1}
              alt="card-image"
              className="h-full w-full object-cover"
            />
          </CardHeader>
          <CardBody>
            <div className="mb-2 flex items-center justify-between">
              <Typography color="blue-gray" className="font-semibold">
                Product 01
              </Typography>
              <Typography color="green" className="font-semibold">
                Ready
              </Typography>
            </div>
          </CardBody>
          <CardFooter className="pt-0">
            <Button
              ripple={false}
              fullWidth={true}
              className="bg-indigo-400/10 text-indigo-900 shadow-none hover:scale-105 hover:shadow-none focus:scale-105 focus:shadow-none active:scale-100"
            >
              Add to Cart
            </Button>
          </CardFooter>
        </Card>

        <Card className="w-80">
          <CardHeader shadow={false} floated={false} className="h-96">
            <img
              src={product1}
              alt="card-image"
              className="h-full w-full object-cover"
            />
          </CardHeader>
          <CardBody>
            <div className="mb-2 flex items-center justify-between">
              <Typography color="blue-gray" className="font-semibold">
                Product 01
              </Typography>
              <Typography color="green" className="font-semibold">
                Ready
              </Typography>
            </div>
          </CardBody>
          <CardFooter className="pt-0">
            <Button
              ripple={false}
              fullWidth={true}
              className="bg-indigo-400/10 text-indigo-900 shadow-none hover:scale-105 hover:shadow-none focus:scale-105 focus:shadow-none active:scale-100"
            >
              Add to Cart
            </Button>
          </CardFooter>
        </Card>

        <Card className="w-80">
          <CardHeader shadow={false} floated={false} className="h-96">
            <img
              src={product1}
              alt="card-image"
              className="h-full w-full object-cover"
            />
          </CardHeader>
          <CardBody>
            <div className="mb-2 flex items-center justify-between">
              <Typography color="blue-gray" className="font-semibold">
                Product 01
              </Typography>
              <Typography color="green" className="font-semibold">
                Ready
              </Typography>
            </div>
          </CardBody>
          <CardFooter className="pt-0">
            <Button
              ripple={false}
              fullWidth={true}
              className="bg-indigo-400/10 text-indigo-900 shadow-none hover:scale-105 hover:shadow-none focus:scale-105 focus:shadow-none active:scale-100"
            >
              Add to Cart
            </Button>
          </CardFooter>
        </Card>

        <Card className="w-80">
          <CardHeader shadow={false} floated={false} className="h-96">
            <img
              src={product1}
              alt="card-image"
              className="h-full w-full object-cover"
            />
          </CardHeader>
          <CardBody>
            <div className="mb-2 flex items-center justify-between">
              <Typography color="blue-gray" className="font-semibold">
                Product 01
              </Typography>
              <Typography color="green" className="font-semibold">
                Ready
              </Typography>
            </div>
          </CardBody>
          <CardFooter className="pt-0">
            <Button
              ripple={false}
              fullWidth={true}
              className="bg-indigo-400/10 text-indigo-900 shadow-none hover:scale-105 hover:shadow-none focus:scale-105 focus:shadow-none active:scale-100"
            >
              Add to Cart
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="my-6">
        <Link
          to="/products"
          className="flex items-center gap-3 bg-indigo-600 text-white text-sm p-3 rounded-md hover:shadow-lg transition ease-in-out"
        >
          See more
          <FaArrowRight />
        </Link>
      </div>
    </div>
  );
};

export default OurProductSection;
