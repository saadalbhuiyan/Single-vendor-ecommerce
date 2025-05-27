const Coupon = require('../models/Coupon');

/**
 * Admin: Create a new coupon
 * POST /api/admin/coupons
 */
exports.createCoupon = async (req, res) => {
    try {
        const {
            code,
            description,
            discountType,
            discountValue,
            minPurchaseAmount,
            maxDiscountAmount,
            usageLimit,
            validFrom,
            validUntil,
            active,
        } = req.body;

        // Basic required field validation
        if (!code || !discountType || !discountValue || !validUntil) {
            return res.status(400).json({ success: false, message: 'Required fields missing' });
        }

        // Check for duplicate coupon code (case-insensitive)
        const existing = await Coupon.findOne({ code: code.toUpperCase().trim() });
        if (existing) {
            return res.status(400).json({ success: false, message: 'Coupon code already exists' });
        }

        const coupon = new Coupon({
            code: code.toUpperCase().trim(),
            description,
            discountType,
            discountValue,
            minPurchaseAmount: minPurchaseAmount || 0,
            maxDiscountAmount: maxDiscountAmount || null,
            usageLimit: usageLimit || null,
            validFrom: validFrom || new Date(),
            validUntil,
            active: active !== undefined ? active : true,
        });

        await coupon.save();
        res.status(201).json({ success: true, data: coupon });
    } catch (error) {
        console.error('createCoupon error:', error);
        res.status(500).json({ success: false, message: 'Server error creating coupon' });
    }
};

/**
 * Admin: Get all coupons sorted by creation date descending
 * GET /api/admin/coupons
 */
exports.getAllCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: coupons });
    } catch (error) {
        console.error('getAllCoupons error:', error);
        res.status(500).json({ success: false, message: 'Server error fetching coupons' });
    }
};

/**
 * Admin: Update coupon by ID
 * PUT /api/admin/coupons/:id
 */
exports.updateCoupon = async (req, res) => {
    try {
        const couponId = req.params.id;
        const updateData = req.body;

        if (updateData.code) {
            updateData.code = updateData.code.toUpperCase().trim();
        }

        const updatedCoupon = await Coupon.findByIdAndUpdate(couponId, updateData, {
            new: true,
            runValidators: true,
        });

        if (!updatedCoupon) {
            return res.status(404).json({ success: false, message: 'Coupon not found' });
        }

        res.status(200).json({ success: true, data: updatedCoupon });
    } catch (error) {
        console.error('updateCoupon error:', error);
        res.status(500).json({ success: false, message: 'Server error updating coupon' });
    }
};

/**
 * Admin: Delete coupon by ID
 * DELETE /api/admin/coupons/:id
 */
exports.deleteCoupon = async (req, res) => {
    try {
        const couponId = req.params.id;
        const deleted = await Coupon.findByIdAndDelete(couponId);

        if (!deleted) {
            return res.status(404).json({ success: false, message: 'Coupon not found' });
        }

        res.status(200).json({ success: true, message: 'Coupon deleted successfully' });
    } catch (error) {
        console.error('deleteCoupon error:', error);
        res.status(500).json({ success: false, message: 'Server error deleting coupon' });
    }
};

/**
 * User: Validate coupon code passed as query param ?code=XYZ123
 * GET /api/coupons/validate?code=XYZ123
 */
exports.validateCoupon = async (req, res) => {
    try {
        const code = req.query.code;
        if (!code) {
            return res.status(400).json({ success: false, message: 'Coupon code is required' });
        }

        const coupon = await Coupon.findOne({ code: code.toUpperCase().trim(), active: true });
        if (!coupon) {
            return res.status(404).json({ success: false, message: 'Invalid or inactive coupon code' });
        }

        const now = new Date();
        if (coupon.validFrom > now || coupon.validUntil < now) {
            return res.status(400).json({ success: false, message: 'Coupon is not valid at this time' });
        }

        if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
            return res.status(400).json({ success: false, message: 'Coupon usage limit exceeded' });
        }

        res.status(200).json({ success: true, data: coupon });
    } catch (error) {
        console.error('validateCoupon error:', error);
        res.status(500).json({ success: false, message: 'Server error validating coupon' });
    }
};

/**
 * User: Get coupon details by ID
 * GET /api/coupons/:id
 */
exports.getCouponById = async (req, res) => {
    try {
        const couponId = req.params.id;
        const coupon = await Coupon.findById(couponId);

        if (!coupon) {
            return res.status(404).json({ success: false, message: 'Coupon not found' });
        }

        res.status(200).json({ success: true, data: coupon });
    } catch (error) {
        console.error('getCouponById error:', error);
        res.status(500).json({ success: false, message: 'Server error fetching coupon' });
    }
};
