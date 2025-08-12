import { Avatar, AvatarFallback, AvatarImage } from "@/app/ui/shadcn/Avatar";

type Props<T> = {
  data: T;
  icon?: React.ReactNode; // або кастомна іконка
  avatarExpression?: (data: T) => string | null;
  fallbackExpression?: (data: T) => string;
  titleExpression: (data: T) => string | React.ReactNode;
};

const ShowcaseItem = <T,>({
  data,
  icon,
  avatarExpression,
  fallbackExpression,
  titleExpression,
}: Props<T>) => {
  const avatarUrl = avatarExpression?.(data) ?? null;
  const fallback = fallbackExpression?.(data) ?? "?";
  const title = titleExpression(data);

  return (
    <div className="flex items-center gap-3">
      {icon ? (
        icon
      ) : (
        <Avatar>
          <AvatarImage src={avatarUrl || "/image-placeholder.avif"} />
          <AvatarFallback>{fallback}</AvatarFallback>
        </Avatar>
      )}
      <span className="text-md">{title}</span>
    </div>
  );
};

export default ShowcaseItem;
