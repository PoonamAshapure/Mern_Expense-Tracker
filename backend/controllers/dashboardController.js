// import Income from "../models/Income.js";
// import Expense from "../models/Expense.js";
// import { isValidObjectId, Types } from "mongoose";

// // Dashboard data
// export const getDashboardData = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const userObjectId = new Types.ObjectId(String(userId));

//     // Fetch total income & expense
//     const totalIncome = await Income.aggregate([
//       { $match: { userId: userObjectId } },
//       { $group: { _id: null, total: { $sum: "$amount" } } },
//     ]);

//     console.log("totalIncome", {
//       totalIncome,
//       userId: isValidObjectId(userId),
//     });

//     const totalExpense = await Expense.aggregate([
//       { $match: { userId: userObjectId } },
//       { $group: { _id: null, total: { $sum: "$amount" } } },
//     ]);

//     // Get income transactions in the last 60days
//     const last60DaysIncomeTransactions = await Income.find({
//       userId,
//       date: { $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) },
//     }).sort({ date: -1 });

//     // Get total income for last 60days
//     const incomeLast60Days = last60DaysIncomeTransactions.reduce(
//       (sum, transaction) => sum + transaction.amount,
//       0
//     );

//     // Get expense transactions int he last 30days
//     const last30DaysExpenseTransactions = await Expense.find({
//       userId,
//       date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
//     }).sort({ date: -1 });

//     // Get total expense for last 30 days
//     const expensesLast30Days = last30DaysExpenseTransactions.reduce(
//       (sum, transaction) => sum + transaction.amount,
//       0
//     );

//     // Fetch last 5 tarnsactions (income + expenses)

//     const lastTransactions = [
//       ...(await Income.find({ userId }).sort({ date: -1 }).limit(5)).map(
//         (txn) => ({
//           ...txn.toObject(),
//           type: "income",
//         })
//       ),
//       ...(await Expense.find({ userId }).sort({ date: -1 }).limit(5)).map(
//         (txn) => ({
//           ...txn.toObject(),
//           type: "expense",
//         })
//       ),
//     ].sort((a, b) => b.date - a.date); // Sort latest first

//     // Final Response
//     res.json({
//       totalBalance:
//         (totalIncome[0]?.total || 0) - (totalExpense[0]?.total || 0),
//       totalIncome: totalIncome[0]?.total || 0,
//       totalExpenses: totalExpense[0]?.total || 0,
//       last30DaysExpenses: {
//         total: expensesLast30Days,
//         transactions: last30DaysExpenseTransactions,
//       },
//       last60DaysIncome: {
//         total: incomeLast60Days,
//         transactions: last60DaysIncomeTransactions,
//       },
//       recentTransactions: lastTransactions,
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Server Error", error });
//   }
// };

import Income from "../models/Income.js";
import Expense from "../models/Expense.js";
import { isValidObjectId, Types } from "mongoose";

export const getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;
    const userObjectId = new Types.ObjectId(String(userId));

    const now = new Date();
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const totalIncome = await Income.aggregate([
      { $match: { userId: userObjectId } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const totalExpense = await Expense.aggregate([
      { $match: { userId: userObjectId } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const last60DaysIncomeTransactions = await Income.find({
      userId: userObjectId,
      date: { $gte: sixtyDaysAgo },
    }).sort({ date: -1 });

    const incomeLast60Days = last60DaysIncomeTransactions.reduce(
      (sum, txn) => sum + txn.amount,
      0
    );

    const last30DaysExpenseTransactions = await Expense.find({
      userId: userObjectId,
      date: { $gte: thirtyDaysAgo },
    }).sort({ date: -1 });

    const expensesLast30Days = last30DaysExpenseTransactions.reduce(
      (sum, txn) => sum + txn.amount,
      0
    );

    const lastTransactions = [
      ...(
        await Income.find({ userId: userObjectId }).sort({ date: -1 }).limit(10)
      ).map((txn) => ({ ...txn.toObject(), type: "income" })),
      ...(
        await Expense.find({ userId: userObjectId })
          .sort({ date: -1 })
          .limit(10)
      ).map((txn) => ({ ...txn.toObject(), type: "expense" })),
    ]
      .sort((a, b) => b.date - a.date)
      .slice(0, 5);

    res.json({
      totalBalance:
        (totalIncome[0]?.total || 0) - (totalExpense[0]?.total || 0),
      totalIncome: totalIncome[0]?.total || 0,
      totalExpenses: totalExpense[0]?.total || 0,
      last30DaysExpenses: {
        total: expensesLast30Days,
        transactions: last30DaysExpenseTransactions,
      },
      last60DaysIncome: {
        total: incomeLast60Days,
        transactions: last60DaysIncomeTransactions,
      },
      recentTransactions: lastTransactions,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};
