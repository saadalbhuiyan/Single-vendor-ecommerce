const Category = require('../models/Category');

/**
 * User-Facing: Get all top-level categories (categories without a parent).
 * GET /api/categories/top-level
 */
exports.getTopLevelCategories = async (req, res) => {
    try {
        const categories = await Category.find({ parent: null }).sort({ name: 1 });
        res.json(categories);
    } catch (error) {
        console.error('getTopLevelCategories error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

/**
 * User-Facing: Get subcategories under a specified parent category.
 * GET /api/categories/:parentId/subcategories
 */
exports.getSubcategories = async (req, res) => {
    try {
        const { parentId } = req.params;
        const subcategories = await Category.find({ parent: parentId }).sort({ name: 1 });
        res.json(subcategories);
    } catch (error) {
        console.error('getSubcategories error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

/**
 * Admin-Facing: Get all categories (flat list).
 * GET /api/admin/categories
 *
 * Note: Consider implementing a tree structure response if required.
 */
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ name: 1 });
        res.json(categories);
    } catch (error) {
        console.error('getAllCategories error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

/**
 * Admin-Facing: Create a new category or subcategory.
 * POST /api/admin/categories
 */
exports.createCategory = async (req, res) => {
    try {
        const { name, description, parent } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Category name is required' });
        }

        if (parent) {
            const parentCategory = await Category.findById(parent);
            if (!parentCategory) {
                return res.status(400).json({ message: 'Invalid parent category' });
            }
        }

        const category = new Category({ name, description, parent: parent || null });
        await category.save();

        res.status(201).json({ message: 'Category created', category });
    } catch (error) {
        console.error('createCategory error:', error);
        if (error.code === 11000) { // Duplicate key error
            return res.status(400).json({ message: 'Category name must be unique' });
        }
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

/**
 * Admin-Facing: Update category details.
 * PUT /api/admin/categories/:id
 */
exports.updateCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const { name, description, parent } = req.body;

        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        if (name !== undefined) category.name = name;
        if (description !== undefined) category.description = description;

        if (parent !== undefined) {
            if (parent === categoryId) {
                return res.status(400).json({ message: 'Category cannot be its own parent' });
            }
            if (parent) {
                const parentCategory = await Category.findById(parent);
                if (!parentCategory) {
                    return res.status(400).json({ message: 'Invalid parent category' });
                }
                category.parent = parent;
            } else {
                category.parent = null;
            }
        }

        await category.save();

        res.json({ message: 'Category updated', category });
    } catch (error) {
        console.error('updateCategory error:', error);
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Category name must be unique' });
        }
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

/**
 * Admin-Facing: Delete a category.
 * DELETE /api/admin/categories/:id
 *
 * Optional: Add checks to prevent deletion if category has subcategories or linked products.
 */
exports.deleteCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;

        const category = await Category.findByIdAndDelete(categoryId);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.json({ message: 'Category deleted' });
    } catch (error) {
        console.error('deleteCategory error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
