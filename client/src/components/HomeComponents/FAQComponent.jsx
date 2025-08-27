import { useState } from "react";

// icons and material-tailwind
import { Accordion, AccordionHeader, AccordionBody, Typography } from "@material-tailwind/react";
import { IoIosArrowDown } from "react-icons/io";

function Icon({ id, open }) {
  return (
    <IoIosArrowDown
      className={`
        ${id === open ? "rotate-180 text-indigo-500" : "text-gray-500"}
        h-5 w-5 transition-all duration-300
      `}
    />
  );
}

const faqData = [
  {
    id: 1,
    question: "What is InventorCS?",
    answer:
      "InventorCS is an inventory management system application used to manage all inventory from each program in the School of Computing and Creative Arts (SoCCA). All inventory items can also be borrowed by all Binusians, including students at Binus University International.",
  },
  {
    id: 2,
    question: "How do I borrow inventory items?",
    answer:
      "To borrow inventory items, the first thing you need to do is register an account through the 'Sign Up' page. After that, you must log in with your registered account, and then you can borrow inventory items just like shopping in an online store.",
  },
  {
    id: 3,
    question: "Where can I see the list of items I am currently borrowing?",
    answer:
      "You can view all the items you are currently borrowing on the 'Dashboard' page under the 'My Loan Transactions' section. There you will find detailed information about all the inventory items you are borrowing in InventorCS.",
  },
  {
    id: 4,
    question: "What should I do if the item I borrowed is damaged?",
    answer:
      "If damage occurs to an inventory item during the borrowing period, please report it by contacting the program staff or lab coordinator of your respective program (via email or direct chat through WhatsApp). Explain the details of the damage so we can follow it up, then promptly return the item to the program staff/lab coordinator (only applicable for inventory items with is_consumable = No).",
  },
  {
    id: 5,
    question: "When is the deadline for returning items?",
    answer:
      "Each item has a different borrowing duration. You can check the return date in the transaction details on your dashboard and on the 'My Loan Transactions' page. If you borrow an item psast the allowed period, the program staff will remind you via email or available contact information.",
  },
  {
    id: 6,
    question: "Is it possible to extend the borrowing period if the return date has passed?",
    answer:
      "Currently, there is no feature to extend the borrowing period for inventory items. However, if it is absolutely necessary, you can contact the program staff/lab coordinator to request an extension, or return the item first and then borrow it again through the website.",
  },
  {
    id: 7,
    question: "Where can I ask questions if they are not answered here?",
    answer:
      "You can ask via email at csbiwebteam@gmail.com or contact the program staff/lab coordinator.",
  },
];

export function FAQComponent() {
  const [open, setOpen] = useState(0);

  const handleOpen = (value) => setOpen(open === value ? 0 : value);

  return (
    <section className="min-h-screen p-4 md:p-8">
      <div className="mx-auto p-6 md:p-8 rounded-xl border-2 border-indigo-50">
        <div className="mb-8 text-center lg:mb-10">
          <Typography
            variant="h1"
            className="my-2 !text-xl lg:!text-2xl bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 bg-clip-text text-transparent"
          >
            Frequently Asked Questions (FAQ)
          </Typography>
          <Typography variant="h6" className="text-xs md:text-base text-gray-600">
            Find answers to common questions about InventorCS
          </Typography>
        </div>

        {faqData.map(({ id, question, answer }) => (
          <Accordion
            key={id}
            open={open === id}
            icon={<Icon id={id} open={open} />}
            className="mb-2 rounded-lg border border-indigo-50 px-4 transition-all duration-300 hover:!scale-[1.02] hover:bg-indigo-50"
          >
            <AccordionHeader
              onClick={() => handleOpen(id)}
              className={`border-b-0 transition-colors duration-300 text-lg text-indigo-700 ${
                open === id ? "!text-indigo-500" : ""
              }`}
            >
              {question}
            </AccordionHeader>
            <AccordionBody className="pt-0 text-sm md:text-base text-gray-700 font-normal">
              {answer}
            </AccordionBody>
          </Accordion>
        ))}
      </div>
    </section>
  );
}

export default FAQComponent;
