import { toPng } from "html-to-image";
import jsPDF from "jspdf";

const ExportButtons = ({ chartRef }) => {
  const exportPNG = async () => {
    if (!chartRef.current) return;

    const dataUrl = await toPng(chartRef.current, {
      pixelRatio: 1.25,
      quality: 0.95,
      cacheBust: true,
    });

    const link = document.createElement("a");
    link.download = "inventorcs_chart.png";
    link.href = dataUrl;
    link.click();
  };

  const exportPDF = async () => {
    if (!chartRef.current) return;

    const chart = chartRef.current;
    const rect = chart.getBoundingClientRect();
    const aspectRatio = rect.width / rect.height;

    const a4Width = 595.28;
    const a4Height = 841.89;

    let imgWidth = a4Width - 40;
    let imgHeight = imgWidth / aspectRatio;

    if (imgHeight > a4Height - 40) {
      imgHeight = a4Height - 40;
      imgWidth = imgHeight * aspectRatio;
    }

    const dataUrl = await toPng(chart, {
      pixelRatio: 1.25,
      quality: 0.95,
      cacheBust: true,
    });

    const pdf = new jsPDF({
      orientation: imgWidth > imgHeight ? "landscape" : "portrait",
      unit: "pt",
      format: "a4",
    });

    pdf.addImage(dataUrl, "JPEG", (a4Width - imgWidth) / 2, 20, imgWidth, imgHeight, "", "FAST");
    pdf.save("inventorcs_chart.pdf");
  };

  return (
    <div className="flex justify-center items-center gap-2">
      <button
        onClick={exportPNG}
        className="bg-white text-gray-800 border px-3 py-1 text-xs rounded-md shadow-md hover:bg-indigo-50 transition-all ease-in-out"
      >
        PNG
      </button>
      <button
        onClick={exportPDF}
        className="bg-white text-gray-800 border px-3 py-1 text-xs rounded-md shadow-md hover:bg-red-50 transition-all ease-in-out"
      >
        PDF
      </button>
    </div>
  );
};

export default ExportButtons;
