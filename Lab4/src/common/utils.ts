export const formatCategory = (category: string): string => {
  return category.replace("EEquippableCategory::", "");
};

// i can't put setWeapon() here bc it depends on the context
