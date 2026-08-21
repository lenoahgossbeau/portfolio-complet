import React from "react";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
}

const colors: Record<string, string> = {
  blue: "from-blue-50 to-white text-blue-600 bg-blue-100",
  green: "from-green-50 to-white text-green-600 bg-green-100",
  purple: "from-purple-50 to-white text-purple-600 bg-purple-100",
  red: "from-red-50 to-white text-red-600 bg-red-100",
  yellow: "from-yellow-50 to-white text-yellow-600 bg-yellow-100",
  orange: "from-orange-50 to-white text-orange-600 bg-orange-100",
  pink: "from-pink-50 to-white text-pink-600 bg-pink-100",
  indigo: "from-indigo-50 to-white text-indigo-600 bg-indigo-100",
  cyan: "from-cyan-50 to-white text-cyan-600 bg-cyan-100",
  emerald: "from-emerald-50 to-white text-emerald-600 bg-emerald-100",
};

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  color,
}) => {
  const style = colors[color] || colors.blue;

  const gradient = style.split(" ").slice(0, 2).join(" ");
  const textColor = style.split(" ")[2];
  const iconBg = style.split(" ")[3];

  return (
    <div
      className={`
        bg-gradient-to-br ${gradient}
        rounded-2xl
        border
        border-gray-100
        shadow-md
        hover:shadow-xl
        hover:-translate-y-1
        transition-all
        duration-300
        p-6
      `}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">
            {title}
          </p>

          <h2 className={`text-4xl font-bold mt-3 ${textColor}`}>
            {value}
          </h2>
        </div>

        {/* ✅ L'icône n'est affichée que si elle est définie */}
        {icon && (
          <div
            className={`w-14 h-14 rounded-full ${iconBg} flex items-center justify-center`}
          >
            <div className={textColor}>
              {icon}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;