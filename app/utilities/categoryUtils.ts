export const normalizeCategory = (category?: string) => {
    if (!category) return 'Other';

    const value = category.toLowerCase();

    if (value === 'men') return 'Men';
    if (value === 'women') return 'Women';
    if (value === 'kids') return 'Kids';

    if (
        value === 'fashion & clothing' ||
        value === 'fashion' ||
        value === 'clothing'
    ) {
        return 'All';
    }

    return category;
};
