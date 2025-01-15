import React from "react";

// icons and material-tailwind
import { Avatar, Card, Typography } from "@material-tailwind/react";

const TableLoanItemInfoComponent = ({ loanItemInfo }) => {
  const TABLE_HEAD = ["No", "Item Name", "Quantity", "Is Consumable?"];

  return (
    <>
      <Card className="w-full max-h-[400px] overflow-y-auto">
        <table className="w-full table-auto text-left">
          <thead className="sticky top-0 z-20">
            <tr>
              {TABLE_HEAD.map((head) => (
                <th
                  key={head}
                  className="border-b border-blue-gray-100 bg-blue-gray-100 p-4"
                >
                  <Typography className="font-normal leading-none opacity-70 text-sm text-gray-900">
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loanItemInfo?.borrowed_item?.map(
              ({ inventory_id, quantity, is_consumable }, index) => {
                const { asset_name, asset_img, _id } = inventory_id;

                return (
                  <tr key={index}>
                    <td className="border-b border-blue-gray-50 p-4">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {index + 1}
                      </Typography>
                    </td>
                    <td className=" border-b border-blue-gray-50 p-4">
                      <a
                        href={`/item_detail/${_id}`}
                        target="_blank"
                        className="flex gap-2 w-max items-center"
                      >
                        <Avatar src={asset_img} alt={asset_name} size="sm" />
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal hover:text-indigo-900 hover:underline transition-all"
                        >
                          {asset_name}
                        </Typography>
                      </a>
                    </td>

                    <td className="border-b border-blue-gray-50 p-4">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {quantity}
                      </Typography>
                    </td>

                    <td className="border-b border-blue-gray-50 p-4">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {is_consumable === true ? "Yes" : "No"}
                      </Typography>
                    </td>
                  </tr>
                );
              }
            )}
          </tbody>
        </table>
      </Card>
    </>
  );
};

export default TableLoanItemInfoComponent;
