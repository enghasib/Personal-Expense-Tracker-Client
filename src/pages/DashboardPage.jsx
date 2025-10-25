import { useEffect, useState } from "react";
import {
  getExpenseSummary,
  getExpenses,
  deleteExpense,
  createExpense,
  updateExpense,
} from "../services/api";
import { useNavigate } from "react-router-dom";
import ExpenseModal from "../components/ExpenseModal";

const DashboardPage = () => {
  const [summary, setSummary] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [filters, setFilters] = useState({ type: "", category: "" });
  // const [pagination, setPagination] = useState({
  //   page: 1,
  //   limit: 10,
  //   totalPage: 1,
  //   totalItems: 0,
  // });
  const navigate = useNavigate();

  const fetchData = async (page = 1) => {
    try {
      const summaryData = await getExpenseSummary();
      setSummary(summaryData);

      const expensesData = await getExpenses({ ...filters, page });
      setExpenses(expensesData.list_of_expenses);
      // setPagination(expensesData.pagination);
    } catch (err) {
      setError(err.message);
      if (err.message.includes("401")) {
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters]);

  const handleDelete = async (id) => {
    try {
      await deleteExpense(id);
      setExpenses(expenses.filter((expense) => expense.id !== id));
      const summaryData = await getExpenseSummary();
      setSummary(summaryData);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleAddExpense = () => {
    setSelectedExpense(null);
    setIsModalOpen(true);
  };

  const handleEditExpense = (expense) => {
    setSelectedExpense(expense);
    setIsModalOpen(true);
  };

  const handleSaveExpense = async (expenseData) => {
    try {
      if (selectedExpense) {
        await updateExpense(selectedExpense.id, expenseData);
      } else {
        await createExpense(expenseData);
      }

      await fetchData(); // updated data from backend

      setIsModalOpen(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // const handlePageChange = (newPage) => {
  //   setPagination((prev) => ({ ...prev, page: newPage }));
  // };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-indigo-600">Dashboard</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/profile")}
                className="px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                Profile
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {error && (
          <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md">
            {error}
          </p>
        )}

        {summary && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-green-500 text-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-medium">Total Income</h3>
                <p className="text-3xl font-bold">
                  ${summary.totalIncome.toLocaleString()}
                </p>
              </div>
              <div className="bg-red-500 text-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-medium">Total Expense</h3>
                <p className="text-3xl font-bold">
                  ${summary.totalExpenses.toLocaleString()}
                </p>
              </div>
              <div className="bg-indigo-500 text-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-medium">Balance</h3>
                <p className="text-3xl font-bold">$ {summary.balance}</p>
              </div>
            </div>
            <div
              className={` ${
                summary.balanceStatus === "Positive"
                  ? "tex bg-green-500 text-white"
                  : "tex bg-red-500 text-white"
              } grid grid-cols rounded-xl p-2 text-center text-2xl mb-2`}
            >
              Account Status: {summary.balanceStatus}
            </div>
          </>
        )}

        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Recent Expenses</h2>
            <button
              onClick={handleAddExpense}
              className="px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              Add Expense
            </button>
          </div>

          <div className="flex space-x-4 mb-4">
            <select
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
            >
              <option value="">All Types</option>
              <option value="INCOME">Income</option>
              <option value="EXPENSE">Expense</option>
            </select>
            <input
              type="text"
              name="category"
              placeholder="Filter by category"
              value={filters.category}
              onChange={handleFilterChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-indigo-500 rounded text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Notes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {expenses.map((expense) => (
                  <tr
                    className={`${
                      expense.is_large ? "bg-red-300" : "bg-white-500"
                    }`}
                    key={expense.id}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {expense.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${expense.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {expense.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {expense.note ? expense.note : "No notes"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          expense.type === "INCOME"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {expense.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditExpense(expense)}
                        className="text-indigo-600 cursor-pointer hover:text-indigo-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(expense.id)}
                        className="text-red-600 cursor-pointer hover:text-red-900 ml-4"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
            >
              Previous
            </button>
            <span>
              Page {pagination.page} of {pagination.totalPage}
            </span>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPage}
              className="px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
            >
              Next
            </button>
          </div> */}
        </div>
      </main>

      {isModalOpen && (
        <ExpenseModal
          expense={selectedExpense}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveExpense}
        />
      )}
    </div>
  );
};

export default DashboardPage;
