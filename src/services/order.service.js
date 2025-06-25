import Order from "../modals/Order.js"
import {v4 as uuidv4} from 'uuid'

const generatePaymentId=()=>{
    return `PAY-${uuidv4()}`;
}
export const createOrderService=async(data)=>{
    const { userId, address, mobileNumber, products } = data;

    if (!userId || !address || !mobileNumber || !products ) {
      throw new Error('Missing required order fields');
    }

const totalQuantity = products.reduce((sum, item) => sum + item.quantity, 0);
const paymentId = generatePaymentId();
const newOrder=new Order({
    user:userId,
    address,
    mobileNumber,
    products,
    totalQuantity,
    totalAmount,
    paymentId
})
return await newOrder.save()
}