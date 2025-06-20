"use client"

import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface BarChartProps {
  data: Array<{
    name: string
    [key: string]: string | number
  }>
  title: string
  dataKeys: Array<{
    key: string
    name: string
  }>
  height?: number
}

export function BarChart({ data, title, dataKeys, height = 300 }: BarChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <RechartsBarChart data={data} barCategoryGap={20}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis
              dataKey="name"
              stroke="#bdbdbd"
              fontSize={13}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#bdbdbd"
              fontSize={13}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            />
            <Legend />
            {dataKeys.map(({ key, name }) => (
              <Bar
                key={key}
                dataKey={key}
                fill="#111"
                radius={[6, 6, 0, 0]}
                name={name}
                barSize={32}
              />
            ))}
          </RechartsBarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
} 