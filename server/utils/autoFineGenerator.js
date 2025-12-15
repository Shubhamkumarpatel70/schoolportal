const Fine = require('../models/Fine');
const Fee = require('../models/Fee');
const Student = require('../models/Student');

// Auto-generate late fines for overdue fees
const generateLateFines = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Find all pending fees that are overdue
    const overdueFees = await Fee.find({
      status: 'pending',
      dueDate: { $lt: today }
    }).populate('studentId');
    
    for (const fee of overdueFees) {
      // Check if late fine already exists for this fee
      const existingFine = await Fine.findOne({
        studentId: fee.studentId._id,
        fineType: 'late',
        reason: `Late Fee Payment - ${fee.feesType || 'monthly'} ${fee.month || ''}`,
        status: { $in: ['pending', 'overdue'] }
      });
      
      if (!existingFine && fee.studentId) {
        // Calculate late fine (e.g., 5% of fee amount or fixed amount)
        const lateFineAmount = Math.max(fee.amount * 0.05, 50); // 5% or minimum ₹50
        
        const lateFine = new Fine({
          studentId: fee.studentId._id,
          userId: fee.userId,
          amount: lateFineAmount,
          reason: `Late Fee Payment - ${fee.feesType || 'monthly'} ${fee.month || ''}`,
          fineType: 'late',
          dueDate: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days from today
          remarks: `Auto-generated late fine for overdue fee: ₹${fee.amount}`
        });
        
        await lateFine.save();
      }
    }
  } catch (error) {
    console.error('Error generating late fines:', error);
  }
};

module.exports = { generateLateFines };

