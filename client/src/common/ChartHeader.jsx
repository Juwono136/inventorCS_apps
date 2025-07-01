import { CiCalendar } from "react-icons/ci";

// components
import ExportButtons from "../common/ChartExportButtons";

const ChartHeader = ({ timeRange, setTimeRange, chartRef }) => {
  return (
    <div className="flex w-full justify-between items-center gap-2 mb-6">
      <div className="flex justify-center gap-2 items-center">
        <CiCalendar className="text-purple-800 text-xl" />
        <select
          value={timeRange}
          onChange={setTimeRange}
          className="border border-gray-300 rounded-md px-3 py-1 text-sm shadow-sm bg-white text-gray-800"
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>
      </div>

      <ExportButtons chartRef={chartRef} />
    </div>
  );
};

export default ChartHeader;
