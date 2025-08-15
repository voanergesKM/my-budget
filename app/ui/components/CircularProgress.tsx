type CircularProgressProps = {
  size?: number;
  strokeWidth?: number;
  variant?: "primary" | "secondary";
};

const CircularProgress = ({
  size = 24,
  strokeWidth = 3,
  variant = "primary",
}: CircularProgressProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const color = variant === "secondary" ? "#fb0707" : "#3b82f6";

  return (
    <svg
      className="animate-spin"
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeWidth={strokeWidth}
        fill="none"
        stroke="#e5e7eb"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeWidth={strokeWidth}
        fill="none"
        stroke={color}
        strokeDasharray={circumference}
        strokeDashoffset={circumference / 4}
        strokeLinecap="round"
      />
    </svg>
  );
};

export default CircularProgress;
