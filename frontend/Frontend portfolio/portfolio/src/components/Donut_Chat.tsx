type DonutChartProps = {
<<<<<<< HEAD
    percentage: number;
    size?: number;
    label?: string;
    admin?: boolean;
  };
  
  export default function DonutChart({ percentage, size = 90, label, admin = false }: DonutChartProps) {
    const strokeWidth = 8;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const progress = circumference - (percentage / 100) * circumference;
  
    return (
      <div className="relative flex items-center justify-center">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
        >
          {/* Background */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e6eaef"
            strokeWidth={strokeWidth}
            fill="none"
          />
  
          {/* Progress */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#33557D"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={progress}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </svg>
  
        {/* Percentage Overlay - NEVER fails */}


        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold text-[#547192]">
            {percentage}
            {!admin && "%"}
          </span>

          {admin && label && (
            <span className="text-xs text-gray-500 text-center">
              {label}
            </span>
          )}
        </div>


        {/** 
          
            {!admin && (
              <span className="absolute text-xl font-bold text-[#547192]">
                {percentage}%
              </span>
            )}

            {admin && (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold text-[#547192]">
                  {percentage}
                </span>
                <span className="text-xs text-gray-500 mt-1">{label}</span>
              </div>
            )}

         */}


      </div>
    );
  }
  
=======
  percentage: number;
  size?: number;
  label?: string;
  admin?: boolean;
  value?: number | string; // ✅ AJOUTÉ
};

export default function DonutChart({ 
  percentage, 
  size = 90, 
  label, 
  admin = false,
  value // ✅ AJOUTÉ
}: DonutChartProps) {
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = circumference - (percentage / 100) * circumference;

  // Valeur à afficher : si value est fournie, on l'utilise, sinon percentage
  const displayValue = value !== undefined ? value : percentage;

  return (
    <div className="relative flex items-center justify-center">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* Background */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e6eaef"
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#33557D"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={progress}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>

      {/* Affichage de la valeur */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-bold text-[#547192]">
          {displayValue}
          {!admin && "%"}
        </span>

        {admin && label && (
          <span className="text-xs text-gray-500 text-center">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
>>>>>>> f4845cf3085e1ea3eadeea21e1681219a592d066
