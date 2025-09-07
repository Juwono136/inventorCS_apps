import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

// components
import Layout from "./Layout";
import DynamicBreadcrumbs from "../../common/DynamicBreadcrumbs";
import Loader from "../../common/Loader";
import UseDocumentTitle from "../../common/UseDocumentTitle";

// features
import { addUserByAdmin, userResetMessage } from "../../features/user/userSlice";

const AddNewUserPage = () => {
  UseDocumentTitle("Add User");

  const programMenu = [
    "Business Information Systems",
    "Business Management & Marketing",
    "Communications",
    "Computer Science",
    "Finance International Program",
    "International Business",
    "Graphic Design and New Media",
    "Digital Business",
    "Overseas Program",
    "Other Program",
  ];

  const roleOptions = [
    { label: "User", value: 0 },
    { label: "Admin", value: 1 },
    { label: "Staff", value: 2 },
  ];

  const [dropDown, setDropDown] = useState(false);
  const [formData, setFormData] = useState({
    binusian_id: "",
    name: "",
    email: "",
    address: "",
    phone: "",
    program: "",
    role: [],
    isError: "",
    isSuccess: "",
  });

  const { binusian_id, name, email, address, phone, program, role } = formData;
  const dispatch = useDispatch();

  const { userInfor, isLoading, isError, isSuccess, message } = useSelector((state) => state.user);

  useEffect(() => {
    if (isError) {
      toast.error(message);
      dispatch(userResetMessage());
    }

    if (isSuccess) {
      toast.success(userInfor.message, { duration: 5000 });
      dispatch(userResetMessage());
      setFormData({
        binusian_id: "",
        name: "",
        email: "",
        address: "",
        phone: "",
        program: "",
        role: [],
      });
    }
  }, [userInfor, isError, isSuccess, message, dispatch, setFormData]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const userData = {
      binusian_id,
      name,
      email,
      address,
      phone,
      program,
      role,
    };

    dispatch(addUserByAdmin(userData));
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value, isError: "", isSuccess: "" });
  };

  const handleRoleChange = (e) => {
    const { value, checked } = e.target;
    const roleValue = parseInt(value);

    setFormData((prevState) => {
      if (checked) {
        return {
          ...prevState,
          role: [...prevState.role, roleValue],
        };
      } else {
        return {
          ...prevState,
          role: prevState.role.filter((r) => r !== roleValue),
        };
      }
    });
  };

  return (
    <Layout>
      <DynamicBreadcrumbs />
      <>
        <div className="flex w-full justify-between items-center">
          <h3 className="text-base font-bold text-indigo-500/60 pointer-events-none sm:text-xl">
            Add a new user
          </h3>
        </div>

        <hr className="w-full border-indigo-100 my-4" />

        {isLoading ? (
          <Loader />
        ) : (
          <div className="flex items-start px-5 py-4 my-2 w-full border-2 border-indigo-100/60 shadow-sm rounded-md">
            <form
              className="flex w-full gap-4 md:gap-8 flex-col lg:flex-row mb-4"
              onSubmit={handleSubmit}
            >
              <div className="flex flex-col gap-4 w-full max-h-max">
                <div>
                  <label
                    htmlFor="binusian_id"
                    className="flex text-sm font-medium leading-6 text-gray-900"
                  >
                    Binusian ID <span className="text-red-600">*</span>
                  </label>

                  <div className="mt-2">
                    <input
                      id="binusian_id"
                      name="binusian_id"
                      type="text"
                      placeholder="Ex: BN123456789"
                      value={binusian_id}
                      onChange={handleOnChange}
                      className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="name"
                    className="flex text-sm font-medium leading-6 text-gray-900"
                  >
                    Name <span className="text-red-600">*</span>
                  </label>
                  <div className="mt-2">
                    <input
                      id="name"
                      name="name"
                      type="name"
                      placeholder="Name of new user"
                      value={name}
                      onChange={handleOnChange}
                      className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="flex text-sm font-medium leading-6 text-gray-900"
                  >
                    Email <span className="text-red-600">*</span>
                  </label>
                  <div className="text-xs text-gray-700 italic">
                    *) Please register using binus email (@binus.ac.id or @binus.edu)
                  </div>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Write the email"
                      value={email}
                      onChange={handleOnChange}
                      className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4 w-full max-h-max">
                <div>
                  <label
                    htmlFor="address"
                    className="flex text-sm font-medium leading-6 text-gray-900"
                  >
                    Address <span className="text-red-600">*</span>
                  </label>
                  <div className="text-xs text-gray-700 italic">
                    *) Example: JWC Campus, Senayan Campus, Anggrek Campus, etc.
                  </div>
                  <div className="mt-2">
                    <input
                      id="address"
                      name="address"
                      type="address"
                      placeholder="Your Address"
                      value={address}
                      onChange={handleOnChange}
                      className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="flex text-sm font-medium leading-6 text-gray-900"
                  >
                    Phone Number <span className="text-red-600">*</span>
                  </label>
                  <div className="mt-2">
                    <input
                      id="phone"
                      name="phone"
                      type="phone"
                      placeholder="Your Phone Number"
                      value={phone}
                      onChange={handleOnChange}
                      className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="select"
                    className="flex text-sm font-medium leading-6 text-gray-900"
                  >
                    Program <span className="text-red-600">*</span>
                  </label>
                  <div className="mt-1 relative">
                    <select
                      id="program"
                      name="program"
                      value={program || "Select your program"}
                      className="block w-full rounded-md border-0 p-3  text-gray-600 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-800 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      onChange={handleOnChange}
                      onClick={() => setDropDown(!dropDown)}
                    >
                      <option hidden disabled value="Select your program">
                        Select Your Program
                      </option>
                      {programMenu.map((program) => (
                        <option key={program} value={program}>
                          {program}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <i
                        className={`${
                          dropDown ? "bx bx-chevron-up" : "bx bx-chevron-down"
                        } text-red-300 text-sm md:text-md`}
                      ></i>
                    </div>
                  </div>
                </div>

                <div className="bg-indigo-50 p-4 rounded-sm">
                  <label className="flex text-sm font-medium text-gray-900">
                    User Role <span className="text-red-600">*</span>
                  </label>
                  <div className="mt-2 flex space-x-4">
                    {roleOptions.map((roleOption) => (
                      <div key={roleOption.value} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`role-${roleOption.value}`}
                          value={roleOption.value}
                          checked={role.includes(roleOption.value)}
                          onChange={handleRoleChange}
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        />
                        <label
                          htmlFor={`role-${roleOption.value}`}
                          className="ml-2 block text-sm text-gray-900"
                        >
                          {roleOption.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex w-full md:justify-end">
                  <input
                    type="submit"
                    value="Add new user"
                    className="md:w-max w-full rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm cursor-pointer hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  />
                </div>
              </div>
            </form>
          </div>
        )}
      </>
    </Layout>
  );
};

export default AddNewUserPage;
