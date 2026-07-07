import Image from "next/image";

interface ChartCardProps {
  icon: string;        // path to icon image
  value: string | number;
  label: string;
  graph: string;       // graph image path
}

export default function ChartCard({
  icon,
  value,
  label,
  graph,
}: ChartCardProps) {
  return (
    <div className="ml-20 bg-white rounded-xl shadow p-4 flex items-center justify-between w-full max-w-[250px]">
      {/* Left Section */}
      <div className="flex items-center gap-1">
        
        {/* Icon Circle */}
        <div className="w-10 h-10 rounded-full bg-[#1E3A5F] flex items-center justify-center">
          <Image
            src={icon}
            alt="Icon"
            width={20}
            height={20}
          />
        </div>

        {/* Text */}
        <div>
          <p className="text-xl font-bold text-gray-800">{value}</p>
          <p className="text-gray-500 text-sm">{label}</p>
        </div>
      </div>

      {/* Graph Image */}
      <Image
        src={graph}
        alt="Graph"
        width={60}
        height={40}
        className="opacity-70"
      />
    </div>
  );
}
