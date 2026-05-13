import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getExpenses, reset } from "../store/expenseSlice";
import { toast } from "react-toastify";
import { IndianRupee, TrendingUp, Calendar, PieChart as PieIcon, ArrowUpRight } from "lucide-react";
import Chartkick, { PieChart } from "react-chartkick";
import Chart from "chart.js/auto";

Chartkick.use(Chart);

const Dashboard = () => {
  const dispatch = useDispatch();
  const { expenses, isLoading, isError, message } = useSelector(
    (state) => state.expense,
  );
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      dispatch(getExpenses());
    }

    return () => {
      dispatch(reset());
    };
  }, [user, dispatch]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
  }, [isError, message]);

  const totalExpense = expenses.reduce((acc, curr) => acc + Number(curr.amount), 0);

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyExpense = expenses
    .filter((expense) => {
      const expenseDate = new Date(expense.date);
      return (
        expenseDate.getMonth() === currentMonth &&
        expenseDate.getFullYear() === currentYear
      );
    })
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  const categoryData = expenses.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + Number(curr.amount);
    return acc;
  }, {});

  const sortedCategories = Object.entries(categoryData)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header>
          <h1 className="text-3xl font-extrabold text-gray-900">Financial Overview</h1>
          <p className="mt-2 text-gray-600">Welcome back! Here's what's happening with your money.</p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-indigo-50 rounded-2xl">
                <IndianRupee className="w-6 h-6 text-indigo-600" />
              </div>
              <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                <ArrowUpRight className="w-3 h-3 mr-1" /> Overall
              </span>
            </div>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Balance</h3>
            <p className="text-3xl font-black text-gray-900 mt-1">₹{totalExpense.toFixed(2)}</p>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-50 rounded-2xl">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <span className="flex items-center text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">
                Current Month
              </span>
            </div>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Monthly Spending</h3>
            <p className="text-3xl font-black text-gray-900 mt-1">₹{monthlyExpense.toFixed(2)}</p>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow lg:col-span-1 md:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-amber-50 rounded-2xl">
                <TrendingUp className="w-6 h-6 text-amber-600" />
              </div>
              <span className="flex items-center text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">
                Insight
              </span>
            </div>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Top Category</h3>
            <p className="text-3xl font-black text-gray-900 mt-1">
              {sortedCategories.length > 0 ? sortedCategories[0][0] : "None"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Spending by Category */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <PieIcon className="w-5 h-5 mr-2 text-indigo-600" /> Spending by Category
              </h2>
            </div>
            <div className="p-6">
              {expenses.length > 0 ? (
                <div className="flex flex-col items-center">
                  <PieChart 
                    data={categoryData} 
                    colors={["#6366f1", "#a855f7", "#f59e0b", "#10b981", "#f43f5e"]}
                    donut={true}
                    legend="bottom"
                    prefix="₹"
                  />
                  <div className="mt-8 w-full space-y-4">
                    {sortedCategories.map(([category, amount], idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`w-2 h-2 rounded-full mr-3 ${['bg-indigo-500', 'bg-purple-500', 'bg-amber-500', 'bg-emerald-500', 'bg-rose-500'][idx % 5]}`}></div>
                          <span className="text-sm font-medium text-gray-700">{category}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm font-bold text-gray-900 mr-4">₹{amount.toFixed(2)}</span>
                          <span className="text-xs font-medium text-gray-400 w-12 text-right">
                            {((amount / totalExpense) * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-center py-8 text-gray-500">No data available yet.</p>
              )}
            </div>
          </div>

          {/* Quick Summary */}
          <div className="bg-indigo-600 rounded-3xl shadow-xl p-8 text-white flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-4">Financial Tip</h2>
              <p className="text-indigo-100 leading-relaxed text-lg">
                "Small expenses add up quickly. Try to save at least 20% of your monthly income by tracking every dollar you spend."
              </p>
            </div>
            <div className="mt-8 pt-8 border-t border-indigo-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-200 text-sm font-medium uppercase tracking-wider">Daily Average</p>
                  <p className="text-3xl font-black mt-1">
                    ${(totalExpense / (expenses.length || 1)).toFixed(2)}
                  </p>
                </div>
                <div className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
