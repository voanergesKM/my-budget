import { Category } from "@/app/lib/definitions";

import ShowcaseItem from "@/app/ui/components/common/ShowcaseItem";

import { categoryIcons } from "@/app/ui/icons/categories";

type Props = {
  category: Category;
};

export const CategoryViewItem = ({ category }: Props) => {
  const IconComponent =
    categoryIcons[category.icon as keyof typeof categoryIcons];

  return (
    <ShowcaseItem<Category>
      data={category}
      icon={
        <div
          className="flex size-8 items-center justify-center rounded-full"
          style={{ backgroundColor: category.color }}
        >
          <IconComponent className="size-4 text-text-primary" />
        </div>
      }
      titleExpression={(category) => category.name}
    />
  );
};
