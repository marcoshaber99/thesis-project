// app/(marketing)/(routes)/dashboard/page.tsx
"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export default function DashboardPage() {
  const surveyData = useQuery(api.surveys.getResults);

  if (!surveyData) {
    return <div>Loading...</div>;
  }

  const satisfactionFields: {
    name: string;
    key: keyof typeof surveyData.satisfaction;
  }[] = [
    { name: "Attractiveness", key: "attractiveness" },
    { name: "Perspicuity", key: "perspicuity" },
    { name: "Efficiency", key: "efficiency" },
    { name: "Dependability", key: "dependability" },
    { name: "Stimulation", key: "stimulation" },
    { name: "Novelty", key: "novelty" },
  ];

  const satisfactionData = satisfactionFields.map((field) => ({
    name: field.name,
    data: surveyData.satisfaction[field.key].map(
      (count: number, index: number) => ({
        name: `${index + 1}`,
        count,
      })
    ),
  }));

  const ageData = surveyData.age.map((count: number, index: number) => ({
    name: ["18-24", "25-29", "30-39", "40-49", "50+"][index],
    count,
  }));

  const genderData = [
    { name: "Male", value: surveyData.gender.male },
    { name: "Female", value: surveyData.gender.female },
    { name: "Other", value: surveyData.gender.other },
  ];

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {satisfactionFields.map((field, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{field.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={satisfactionData[index].data}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill={COLORS[index % COLORS.length]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        ))}
        <Card>
          <CardHeader>
            <CardTitle>Age Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={ageData}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#82ca9d"
                  label
                >
                  {ageData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Gender Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={genderData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label
                >
                  {genderData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
