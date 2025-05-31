const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Coupon = require('../models/Coupon');

/**
 * Calculate total amount for cart items considering coupon discounts.
 * Ensures total is never negative.
 */
const calculateTotal = (cart, coupon) => {
    let total = 0;
    cart.items.forEach(item => {
        let price = 0;
        if (item.variant) {
            const variantDetail = item.product.variants.find(
                v => v._id.toString() === item.variant.toString()
            );
            price = variantDetail ? variantDetail.price : 0;
        } else {
            price = item.product.price || 0;
        }
        total += price * item.quantity;
    });

    if (coupon) {
        if (coupon.discountType === 'percentage') {
            total -= (total * coupon.discountValue) / 100;
        } else if (coupon.discountType === 'fixed') {
            total -= coupon.discountValue;
        }
    }

    return total < 0 ? 0 : total;
};

/**
 * Create a new order from the authenticated user's cart.
 * Clears cart upon successful order creation.
 */
exports.createOrder = async (req, res) => {
    try {
        const userId = req.user._id;

        // Fetch cart with populated products
        const cart = await Cart.findOne({ user: userId }).populate('items.product');
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ success: false, message: 'Cart is empty' });
        }

        // Retrieve valid coupon details if applied
        let couponData = null;
        if (cart.coupon && cart.coupon.code) {
            const coupon = await Coupon.findOne({ code: cart.coupon.code, active: true });
            if (coupon) {
                couponData = {
                    code: coupon.code,
                    discountType: coupon.discountType,
                    discountValue: coupon.discountValue,
                };
            }
        }

        const totalAmount = calculateTotal(cart, couponData);

        // Prepare order items with price details
        const orderItems = cart.items.map(item => {
            let price = 0;
            if (item.variant) {
                const variantDetail = item.product.variants.find(
                    v => v._id.toString() === item.variant.toString()
                );
                price = variantDetail ? variantDetail.price : 0;
            } else {
                price = item.product.price || 0;
            }
            return {
                product: item.product._id,
                variant: item.variant || null,
                quantity: item.quantity,
                price,
            };
        });

        // Create and save the order
        const order = new Order({
            user: userId,
            items: orderItems,
            totalAmount,
            coupon: couponData,
            shippingAddress: req.body.shippingAddress || {},
            paymentStatus: 'pending',
            orderStatus: 'pending',
            paymentMethod: 'DemoGateway',
        });

        await order.save();

        // Clear the user's cart after order creation
        cart.items = [];
        cart.coupon = null;
        await cart.save();

        res.status(201).json({ success: true, order });
    } catch (error) {
        console.error('createOrder error:', error);
        res.status(500).json({ success: false, message: 'Server error creating order' });
    }
};

/**
 * Get all orders for the authenticated user.
 */
exports.getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, orders });
    } catch (error) {
        console.error('getUserOrders error:', error);
        res.status(500).json({ success: false, message: 'Server error fetching orders' });
    }
};

/**
 * Get a single order by ID for the authenticated user.
 */
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findOne({ _id: req.params.id, user: req.user._id })
            .populate('items.product')
            .populate('items.variant');

        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

        res.status(200).json({ success: true, order });
    } catch (error) {
        console.error('getOrderById error:', error);
        res.status(500).json({ success: false, message: 'Server error fetching order' });
    }
};

/**
 * Cancel an order if it hasn't shipped or been delivered yet.
 */
exports.cancelOrder = async (req, res) => {
    try {
        const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

        if (['shipped', 'delivered'].includes(order.orderStatus)) {
            return res.status(400).json({ success: false, message: 'Cannot cancel shipped or delivered order' });
        }

        order.orderStatus = 'cancelled';
        await order.save();

        res.status(200).json({ success: true, message: 'Order cancelled', order });
    } catch (error) {
        console.error('cancelOrder error:', error);
        res.status(500).json({ success: false, message: 'Server error cancelling order' });
    }
};

/**
 * Provide payment gateway URL for the order payment initiation.
 */
exports.initiatePayment = async (req, res) => {
    try {
        const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

        if (order.paymentStatus === 'paid') {
            return res.status(400).json({ success: false, message: 'Order already paid' });
        }

        const paymentGatewayUrl = `https://demo-payment-gateway.com/pay?orderId=${order._id}&amount=${order.totalAmount}`;

        res.status(200).json({ success: true, paymentGatewayUrl });
    } catch (error) {
        console.error('initiatePayment error:', error);
        res.status(500).json({ success: false, message: 'Server error initiating payment' });
    }
};

/**
 * Handle successful payment notification.
 */
exports.handlePaymentSuccess = async (req, res) => {
    try {
        const { tran_id } = req.body;

        const order = await Order.findById(tran_id);
        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

        order.paymentStatus = 'paid';
        order.orderStatus = 'processing';
        await order.save();

        res.status(200).json({ success: true, message: 'Payment successful', order });
    } catch (error) {
        console.error('handlePaymentSuccess error:', error);
        res.status(500).json({ success: false, message: 'Server error handling payment success' });
    }
};

/**
 * Handle failed payment notification.
 */
exports.handlePaymentFail = async (req, res) => {
    try {
        const { tran_id } = req.body;

        const order = await Order.findById(tran_id);
        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

        order.paymentStatus = 'failed';
        order.orderStatus = 'pending';
        await order.save();

        res.status(200).json({ success: true, message: 'Payment failed', order });
    } catch (error) {
        console.error('handlePaymentFail error:', error);
        res.status(500).json({ success: false, message: 'Server error handling payment fail' });
    }
};

/**
 * Request a return for an order.
 */
exports.requestReturn = async (req, res) => {
    try {
        const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

        if (order.returnRequested) {
            return res.status(400).json({ success: false, message: 'Return already requested' });
        }

        order.returnRequested = true;
        order.returnReason = req.body.reason || '';
        order.orderStatus = 'returned';
        await order.save();

        res.status(200).json({ success: true, message: 'Return requested', order });
    } catch (error) {
        console.error('requestReturn error:', error);
        res.status(500).json({ success: false, message: 'Server error requesting return' });
    }
};

/**
 * Get all orders (admin level).
 */
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, orders });
    } catch (error) {
        console.error('getAllOrders error:', error);
        res.status(500).json({ success: false, message: 'Server error fetching all orders' });
    }
};

/**
 * Update order status (admin level).
 */
exports.updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const order = await Order.findById(id);
        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

        order.orderStatus = status;
        order.updatedAt = new Date();

        await order.save();

        res.status(200).json({ success: true, message: 'Order status updated', order });
    } catch (error) {
        console.error('updateOrderStatus error:', error);
        res.status(500).json({ success: false, message: 'Server error updating order status' });
    }
};

/**
 * Approve order cancellation (admin level).
 */
exports.approveOrderCancellation = async (req, res) => {
    try {
        const { id } = req.params;

        const order = await Order.findById(id);
        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

        order.orderStatus = 'cancelled';
        order.updatedAt = new Date();

        await order.save();

        res.status(200).json({ success: true, message: 'Order cancellation approved', order });
    } catch (error) {
        console.error('approveOrderCancellation error:', error);
        res.status(500).json({ success: false, message: 'Server error approving cancellation' });
    }
};
