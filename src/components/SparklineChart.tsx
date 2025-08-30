import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface SparklineChartProps {
  data: number[];
  isPositive: boolean;
}

const SparklineChart = ({ data, isPositive }: SparklineChartProps) => {
  // Convert array of prices to chart data format
  const chartData = data.map((price, index) => ({
    index,
    price,
  }));

  // Determine the color based on trend
  const strokeColor = isPositive ? 'hsl(var(--success))' : 'hsl(var(--destructive))';

  return (
    <div className="w-20 h-8">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <Line
            type="monotone"
            dataKey="price"
            stroke={strokeColor}
            strokeWidth={1.5}
            dot={false}
            activeDot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SparklineChart;