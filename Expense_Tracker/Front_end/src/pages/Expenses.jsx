import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  reset,
} from "../store/expenseSlice";
import { toast } from "react-toastify";
import { PlusCircle, Pencil, Trash2, X, Loader2, DollarSign, Tag, FileText, ScanLine, Calendar } from "lucide-react";
import axios from "axios";

const Expenses = () => {
  const dispatch = useDispatch();
  const { expenses, isLoading, isError, message } = useSelector(
    (state) => state.expense,
  );
  const { user } = useSelector((state) => state.auth);

  const [isEditing, setIsEditing] = useState(false);
  const [currentExpenseId, setCurrentExpenseId] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });

  const { title, amount, category, description, date } = formData;

  const handleScanBill = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const scanFormData = new FormData();
    scanFormData.append("bill", file);

    setIsScanning(true);
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const response = await axios.post("http://localhost:5050/api/expenses/scan", scanFormData, config);
      const { title, amount, category, date } = response.data;
      
      setFormData((prev) => ({
        ...prev,
        title: title || prev.title,
        amount: amount || prev.amount,
        category: category || prev.category,
        date: date || prev.date,
        description: `Scanned from bill on ${new Date().toLocaleDateString()}`,
      }));
      
      toast.success("Bill scanned and form filled!");
    } catch (error) {
      console.error("Scan error:", error);
      toast.error(error.response?.data?.message || "Failed to scan bill");
    } finally {
      setIsScanning(false);
      // Clear input so same file can be selected again if needed
      e.target.value = null;
    }
  };

  useEffect(() => {
    if (!user) {
      return;
    }
    dispatch(getExpenses());

    return () => {
      dispatch(reset());
    };
  }, [user, dispatch]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
  }, [isError, message]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      dispatch(updateExpense({ id: currentExpenseId, expenseData: formData }));
      setIsEditing(false);
      setCurrentExpenseId(null);
      toast.success("Expense updated");
    } else {
      dispatch(createExpense(formData));
      toast.success("Expense added");
    }
    setFormData({
      title: "",
      amount: "",
      category: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
    });
  };

  const onEdit = (expense) => {
    setIsEditing(true);
    setCurrentExpenseId(expense._id);
    setFormData({
      title: expense.title,
      amount: expense.amount,
      category: expense.category,
      description: expense.description || "",
      date: expense.date ? new Date(expense.date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      dispatch(deleteExpense(id));
      toast.success("Expense deleted");
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setCurrentExpenseId(null);
    setFormData({
      title: "",
      amount: "",
      category: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Expense Tracker
          </h1>
          <p className="mt-3 text-lg text-gray-500">
            Keep track of your spending and manage your budget efficiently.
          </p>
        </div>

        {/* Add/Edit Form */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="bg-indigo-600 px-8 py-4 flex justify-between items-center">
            <h2 className="text-xl font-bold text-white flex items-center">
              {isEditing ? (
                <>
                  <Pencil className="w-5 h-5 mr-2" /> Edit Expense
                </>
              ) : (
                <>
                  <PlusCircle className="w-5 h-5 mr-2" /> Add New Expense
                </>
              )}
            </h2>
            <div className="flex items-center space-x-4">
              {!isEditing && (
                <>
                  <input
                    type="file"
                    id="scan-bill"
                    className="hidden"
                    accept="image/*,application/pdf"
                    onChange={handleScanBill}
                    disabled={isScanning}
                  />
                  <label
                    htmlFor="scan-bill"
                    className={`flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-bold transition-all cursor-pointer border border-white/20 shadow-lg ${isScanning ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {isScanning ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Scanning...</span>
                      </>
                    ) : (
                      <>
                        <ScanLine className="w-4 h-4" />
                        <span>Scan Bill</span>
                      </>
                    )}
                  </label>
                </>
              )}
              {isEditing && (
                <button
                  onClick={cancelEdit}
                  className="text-white/80 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              )}
            </div>
          </div>
          <form onSubmit={onSubmit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Title</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-600">
                  <FileText className="h-5 w-5" />
                </div>
                <input
                  name="title"
                  type="text"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium text-gray-900 outline-none shadow-sm"
                  placeholder="What was it for?"
                  value={title}
                  onChange={onChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Amount</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-600">
                  <DollarSign className="h-5 w-5" />
                </div>
                <input
                  name="amount"
                  type="number"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium text-gray-900 outline-none shadow-sm"
                  placeholder="0.00"
                  value={amount}
                  onChange={onChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Date</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-600">
                  <Calendar className="h-5 w-5" />
                </div>
                <input
                  name="date"
                  type="date"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium text-gray-900 outline-none shadow-sm"
                  value={date}
                  onChange={onChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Category</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-600">
                  <Tag className="h-5 w-5" />
                </div>
                <select
                  name="category"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium text-gray-900 outline-none shadow-sm appearance-none"
                  value={category}
                  onChange={onChange}
                >
                  <option value="">Select Category</option>
                  <option value="Food">Food</option>
                  <option value="Transport">Transport</option>
                  <option value="Rent">Rent</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Health">Health</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Others">Others</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Description (Optional)</label>
              <div className="relative group">
                <div className="absolute top-3 left-4 text-gray-400 group-focus-within:text-indigo-600">
                  <FileText className="h-5 w-5" />
                </div>
                <textarea
                  name="description"
                  rows="1"
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium text-gray-900 outline-none shadow-sm resize-none"
                  placeholder="Add a note..."
                  value={description}
                  onChange={onChange}
                ></textarea>
              </div>
            </div>

            <div className="md:col-span-2 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-4 px-4 font-bold rounded-2xl text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-indigo-500/25 hover:-translate-y-0.5 active:translate-y-0"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                ) : isEditing ? (
                  <Pencil className="w-5 h-5 mr-2" />
                ) : (
                  <PlusCircle className="w-5 h-5 mr-2" />
                )}
                {isEditing ? "Update Expense" : "Add Expense"}
              </button>
            </div>
          </form>
        </div>

        {/* Expense Table */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h2 className="text-xl font-bold text-gray-900">Recent Expenses</h2>
            <div className="text-sm font-medium text-indigo-600 bg-indigo-50 px-4 py-1.5 rounded-full">
              Total: {expenses.length}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">No.</th>
                  <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {expenses.length > 0 ? (
                  expenses.map((expense, index) => (
                    <tr key={expense._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-8 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                      <td className="px-8 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(expense.date).toLocaleDateString()}
                      </td>
                      <td className="px-8 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-gray-900">{expense.title}</div>
                        {expense.description && (
                          <div className="text-xs text-gray-500 truncate max-w-[200px]">{expense.description}</div>
                        )}
                      </td>
                      <td className="px-8 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700">
                          {expense.category}
                        </span>
                      </td>
                      <td className="px-8 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                        ${Number(expense.amount).toFixed(2)}
                      </td>
                      <td className="px-8 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                        <button
                          onClick={() => onEdit(expense)}
                          className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 p-2 rounded-xl transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => onDelete(expense._id)}
                          className="text-red-600 hover:text-red-900 bg-red-50 p-2 rounded-xl transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-8 py-12 text-center text-gray-500 font-medium">
                      No expenses found. Start adding some!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Expenses;
