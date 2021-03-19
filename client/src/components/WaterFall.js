import { TickFormatter } from "@nivo/axes";
import { ResponsiveBar, ValueFormatter } from "@nivo/bar";
import { useTheme } from "@nivo/core";

interface IWaterfallDatum {
  category: string;
  amount: number;
}

interface IWaterfallBarDatum {
  category: string;
  amount: number;
  subTotal: number;
  color: string;
}

const calcWaterfallData = (_data: IWaterfallDatum[]) => {
  if (_data.length === 0) return [];
  const initialSign = Math.sign(_data[0].amount);
  let subTotal = 0;
  const data = _data.reduce((prev, x) => {
    const { category, amount: _amount } = x;
    const color = _amount < 0 ? "#db4437" : "#93c47d";
    const sameInitialSign = Math.sign(_amount) === initialSign;
    const amount = initialSign * Math.abs(_amount);
    if (!sameInitialSign) subTotal += _amount;
    prev.push({ category, amount, subTotal, color });
    if (sameInitialSign) subTotal += _amount;
    return prev;
  }, []);
  data.push({
    category: "End Balance",
    amount: subTotal,
    subTotal: 0,
    color: subTotal < 0 ? "#a00000" : "#38761d",
  });
  return data;
};

const WrappedTick = (tick: any) => {
  const theme = useTheme();
  const fontSize = 10;
  const words = tick.value.split(" ");
  return (
    <g transform={`translate(${tick.x},${tick.y + 22})`}>
      <line strokeWidth={1.5} y1={-22} y2={-12} style={theme.axis.ticks.line} />
      {words.map((x, i) => (
        <text
          key={i}
          textAnchor="middle"
          dominantBaseline="middle"
          y={fontSize * i}
          style={{
            ...theme.axis.ticks.text,
            fontSize,
          }}
        >
          {x}
        </text>
      ))}
    </g>
  );
};

interface IProps {
  data: IWaterfallDatum[];
  legend: string;
  tooltipFormat?: string | ValueFormatter;
  leftAxisFormat?: string | TickFormatter;
}

const WaterfallChart = (props: IProps) => {
  const { data: _data, legend, tooltipFormat, leftAxisFormat } = props;

  const data = calcWaterfallData(_data);
  const transparent = "rgba(0, 0, 0, 0)";
  return (
    <ResponsiveBar
      data={data}
      keys={["subTotal", "amount"]}
      indexBy={"category"}
      margin={{ top: 15, right: 0, bottom: 75, left: 40 }}
      padding={0.3}
      colors={({ id, data }) => (id === "subTotal" ? transparent : data.color)}
      borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        renderTick: WrappedTick,
      }}
      axisLeft={{
        tickSize: 0,
        tickPadding: 5,
        tickRotation: 0,
        format: leftAxisFormat,
        legend,
        legendOffset: -35,
        legendPosition: "middle",
      }}
      enableLabel={false}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
      animate={true}
      motionStiffness={90}
      motionDamping={15}
      tooltipFormat={tooltipFormat}
      onClick={(data) => {
        console.log(data);
      }}
    />
  );
};

export default WaterfallChart;
