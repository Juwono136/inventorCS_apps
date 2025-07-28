import { useSelector } from "react-redux";

// icons and material-tailwind
import { MdOutlineInventory2, MdAccessTime } from "react-icons/md";

// components
import Layout from "./Layout";
import UseDocumentTitle from "../../common/UseDocumentTitle";

// features
import StaffDashboardComponent from "../../components/DashboardComponents/StaffDashboardComponent";
import UserDashboardComponent from "../../components/DashboardComponents/UserDashboardComponent";

const DashboardPage = ({ page, sort, categories, search, limit }) => {
  UseDocumentTitle("Dashboard");

  const { userInfor } = useSelector((state) => state.user);
  const { user } = useSelector((state) => state.auth);

  const currentTime = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());

  const getRoleBadge = (role) => {
    switch (role) {
      case 1:
        return { label: "Admin", className: "bg-green-50 text-green-700 border-green-300" };
      case 2:
        return { label: "Staff", className: "bg-orange-50 text-orange-700 border-orange-300" };
      default:
        return { label: "User", className: "bg-blue-50 text-blue-700 border-blue-300" };
    }
  };

  return (
    <Layout>
      <div className="flex gap-2 flex-col lg:justify-between lg:flex-row">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-bold text-indigo-500/60 pointer-events-none">Dashboard</h3>
            {user && (
              <span
                className={`text-xs font-medium border px-3 py-1 rounded-full ${
                  getRoleBadge(user.selectedRole).className
                }`}
              >
                {getRoleBadge(user.selectedRole).label}
              </span>
            )}
          </div>
          <h3 className="text-sm md:text-lg font-semibold text-gray-800/60 pointer-events-none">
            Welcome, <span className="text-indigo-800/80">{userInfor?.personal_info?.name}</span>
          </h3>
          <p className="flex items-center gap-1 text-xs text-gray-600">
            <MdAccessTime />
            {currentTime}
          </p>
        </div>

        <div className="text-xs text-blue-900">
          <a
            href="/inventory-list"
            className="flex items-center justify-center gap-2 border px-4 py-2 border-blue-600 rounded-md hover:bg-blue-800 hover:text-white transition-all"
          >
            <MdOutlineInventory2 className="w-4 h-4" />
            View All Inventory
          </a>
        </div>
      </div>

      {/* staff dashboard component */}
      {user?.selectedRole === 2 && (
        <StaffDashboardComponent
          page={page}
          sort={sort}
          categories={categories}
          search={search}
          limit={limit}
        />
      )}

      {/* admin dashboard component */}
      {user?.selectedRole === 1 && (
        <div className="pt-4 text-green-700 text-sm font-medium">
          🛠️ Admin dashboard coming soon...
        </div>
      )}

      {/* user dashboard component */}
      {user?.selectedRole === 0 && <UserDashboardComponent />}

      {/* Inventory stock chart component */}
      {/* <div className="flex w-full pt-4">
        <InventoryStockChartComponent />
      </div> */}
    </Layout>
  );
};

export default DashboardPage;
