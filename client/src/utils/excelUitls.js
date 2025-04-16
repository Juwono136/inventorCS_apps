import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import toast from "react-hot-toast";

// features
import { createInventory } from "../features/inventory/inventorySlice";
import { accessToken } from "../features/token/tokenSlice";

const headerColumns = [
    { header: "Item Image", key: "asset_img", width: 30 },
    { header: "Item Info", key: "asset_name", width: 25 },
    { header: "Serial Number", key: "serial_number", width: 25 },
    { header: "Item Location", key: "location", width: 20 },
    { header: "Room Number", key: "room_number", width: 15 },
    { header: "Item Cabinet", key: "cabinet", width: 20 },
    { header: "Item Category", key: "categories", width: 20 },
    { header: "Total Items", key: "total_items", width: 15 },
    { header: "Is Consumable? (Yes/No)", key: "is_consumable", width: 15 },
    { header: "Item Description", key: "desc", width: 50 },
]

// Download excel template
export const downloadExcelTemplate = async (setProgress) => {
    try {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Template Inventories");

        worksheet.columns = headerColumns;

        worksheet.getCell("A1").note = "Upload an image directly in this column. Do not enter a Image URL Link!.";
        worksheet.getCell("B1").note = "Item name cannot be less than 3 and exceed 80 characters.";
        worksheet.getCell("C1").note = "Serial number cannot exceed 15 characters.";
        worksheet.getCell("H1").note = "Please input the total items with a positive number.";

        const sampleRow = worksheet.addRow({
            asset_img: "",
            asset_name: "Laptop Dell XPS",
            serial_number: "DELL123456",
            location: "FX Senayan Campus",
            room_number: "R632",
            cabinet: "A1",
            categories: "PC & Laptops",
            total_items: 10,
            is_consumable: "No",
            desc: "Dell XPS was a line of consumer-oriented laptop and desktop computers manufactured by Dell from 1993 to 2025. Dell XPS. A Dell XPS 13 and 15"
        });

        worksheet.getRow(sampleRow.number).height = 180;

        // Add data validation for categories and is_consumable
        for (let i = 2; i <= 101; i++) {
            worksheet.getCell(`G${i}`).dataValidation = {
                type: "list",
                formulae: ["\"Creative Tools,Board Game,IOT,IOT Parts,PC & Laptop,Peripheral,Others\""],
                showErrorMessage: true,
                errorTitle: "Invalid Category",
                error: "Please select a valid category from the dropdown list."
            };

            worksheet.getCell(`I${i}`).dataValidation = {
                type: "list",
                formulae: ["\"Yes, No\""],
                showErrorMessage: true,
                errorTitle: "Invalid Category for Consumable",
                error: "Please select a valid category from the dropdown list."
            };
        }

        const headerRow = worksheet.getRow(1);
        headerRow.eachCell((cell) => {
            cell.font = { bold: true };
        });

        setProgress(50);
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        saveAs(blob, "Inventory_Template.xlsx");
        setProgress(100);
        toast.success("Excel template successfully downloaded!");
    } catch (error) {
        toast.error("Failed to download the template!");
        setProgress(0);
    }
};

// export data to excel
export const exportToExcel = async (data, setProgress) => {
    try {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Inventories");

        worksheet.columns = headerColumns

        data.forEach((item) => {
            worksheet.addRow({
                asset_img: item.asset_img,
                asset_name: item.asset_name,
                serial_number: item.serial_number,
                location: item.location,
                room_number: item.room_number,
                cabinet: item.cabinet,
                categories: item.categories.join(", "),
                item_status: item.item_status,
                is_consumable: item.is_consumable ? "Yes" : "No",
                desc: item.desc
            });
        });

        setProgress(50);
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        saveAs(blob, "Inventories.xlsx");
        setProgress(100);
        toast.success("Successfully export to excel file");
    } catch (error) {
        toast.error("Failed to export the data!");
        setProgress(0);
    }
};

// import data from excel file
export const importFromExcel = async (file, setProgress, setData, dispatch) => {
    try {
        const workbook = new ExcelJS.Workbook();
        const reader = new FileReader();

        reader.readAsArrayBuffer(file);
        reader.onload = async (e) => {
            const buffer = e.target.result;
            await workbook.xlsx.load(buffer);

            const worksheet = workbook.getWorksheet("Template Inventories");
            if (!worksheet) {
                toast.error("Incorrect File Format!");
                return;
            }

            const importedData = [];
            const promises = [];
            let hasError = false;

            const imageMap = {};
            // convert image uploaded to base64 format
            workbook.worksheets.forEach((sheet) => {
                sheet.getImages().forEach((img) => {
                    const image = workbook.model.media.find(m => m.index === img.imageId);
                    if (image) {
                        const base64Image = `data:image/${image.extension};base64,${image.buffer.toString("base64")}`;
                        imageMap[img.range.tl.nativeRow + 1] = base64Image;
                    }
                });
            });

            worksheet.eachRow((row, rowNumber) => {
                if (rowNumber > 1) {
                    const addData = {
                        asset_img: imageMap[rowNumber] || "",
                        asset_name: row.getCell(2).value,
                        serial_number: row.getCell(3).value,
                        location: row.getCell(4).value,
                        room_number: row.getCell(5).value,
                        cabinet: row.getCell(6).value,
                        categories: row.getCell(7).value.split(","),
                        total_items: parseInt(row.getCell(8).value, 10),
                        is_consumable: row.getCell(9).value.toLowerCase() === "yes",
                        desc: row.getCell(10).value
                    };

                    importedData.push(addData);


                    if (!addData.asset_name || addData.asset_name.length < 3 || addData.asset_name.length > 80) {
                        toast.error(`Row ${rowNumber}: Item name is required and must not less than 3 or exceed 80 characters.`,
                            { position: "bottom-right" }
                        );
                        hasError = true;
                        return;
                    }

                    if (!addData.serial_number || addData.serial_number.length > 15) {
                        toast.error(`Row ${rowNumber}: Serial number is required and must not exceed 15 characters.`,
                            { position: "bottom-right" }
                        );
                        hasError = true;
                        return;
                    }

                    if (!addData.total_items || isNaN(addData.total_items) || addData.total_items < 0) {
                        toast.error(`Row ${rowNumber}: Total items must be a valid and positive number.`,
                            { position: "bottom-right" }
                        );
                        hasError = true;
                        return;
                    }

                    const promise = dispatch(createInventory(addData))
                        .then((res) => {
                            if (res.error) {
                                throw new Error(`Row ${rowNumber}: ${res.error.message}`);
                            }
                            dispatch(accessToken(res));
                        })
                        .catch((err) => {
                            toast.error(`Failed to import row ${rowNumber}: ${err.message}`);
                        });

                    promises.push(promise);
                }
            });

            await Promise.allSettled(promises);

            if (!hasError) {
                setData(importedData);
                toast.success("Inventories successfully imported!");

                setTimeout(() => {
                    window.location.href = `${window.location.origin}/inventories`;
                }, 1000);
            }

            setProgress(100);
            setTimeout(() => setProgress(0), 2000);
        };
    } catch (error) {
        toast.error("Failed to import the data!");
        setProgress(0);
    }
};