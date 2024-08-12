"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ComposedChart,
  Area,
} from "recharts";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

type Gender = "male" | "female" | "other";

interface SurveyResult {
  _id: string;
  _creationTime: number;
  userId?: string;
  attractiveness: string;
  perspicuity: string;
  efficiency: string;
  dependability: string;
  stimulation: string;
  novelty: string;
  feedback: string;
  age: string;
  gender: Gender;
  createdAt: number;
}

interface SatisfactionData {
  attractiveness: number[];
  perspicuity: number[];
  efficiency: number[];
  dependability: number[];
  stimulation: number[];
  novelty: number[];
}

export default function DashboardPage() {
  const surveyData = useQuery(api.surveys.getResults);
  const [searchQuery, setSearchQuery] = useState("");

  if (!surveyData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-gray-500">Loading...</div>
      </div>
    );
  }

  const satisfactionFields = [
    { name: "Attractiveness", key: "attractiveness" },
    { name: "Perspicuity", key: "perspicuity" },
    { name: "Efficiency", key: "efficiency" },
    { name: "Dependability", key: "dependability" },
    { name: "Stimulation", key: "stimulation" },
    { name: "Novelty", key: "novelty" },
  ] as const;

  const satisfactionData = satisfactionFields.map((field) => {
    const totalScore = surveyData.satisfaction[field.key].reduce(
      (sum: number, count: number, index: number) => sum + count * (index + 1),
      0
    );
    const totalResponses = surveyData.satisfaction[field.key].reduce(
      (sum: number, count: number) => sum + count,
      0
    );
    const averageScore = totalResponses > 0 ? totalScore / totalResponses : 0;
    return {
      name: field.name,
      score: Number(averageScore.toFixed(2)),
    };
  });

  const ageData = surveyData.age.map((count: number, index: number) => ({
    name: ["18-24", "25-29", "30-39", "40-49", "50+"][index],
    count,
  }));

  const genderData = [
    { name: "Male", value: surveyData.gender.male },
    { name: "Female", value: surveyData.gender.female },
    { name: "Other", value: surveyData.gender.other },
  ];

  const feedbackData = surveyData.feedback
    .map((feedback: string, index: number) => ({
      id: index,
      feedback,
      sentiment: analyzeSentiment(feedback),
    }))
    .filter(
      (entry) =>
        entry.feedback &&
        entry.feedback.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const totalFeedback = surveyData.feedback.filter((f: string) => f).length;
  const averageRating =
    satisfactionData.reduce((sum, field) => sum + field.score, 0) /
    satisfactionData.length;
  const positivePercentage = Math.round(
    (feedbackData.filter((entry) => entry.sentiment === "positive").length /
      totalFeedback) *
      100
  );

  const averageSatisfactionByAge = ageData.map((ageGroup) => {
    const relevantResults = surveyData.results.filter(
      (result: SurveyResult) => result.age === ageGroup.name
    );
    const totalScore = relevantResults.reduce(
      (sum, result) =>
        sum +
        satisfactionFields.reduce(
          (fieldSum, field) => fieldSum + parseInt(result[field.key], 10),
          0
        ),
      0
    );
    const totalResponses = relevantResults.length * satisfactionFields.length;
    return {
      age: ageGroup.name,
      score: totalResponses > 0 ? totalScore / totalResponses : 0,
    };
  });

  const averageSatisfactionByGender = Object.keys(surveyData.gender).map(
    (gender) => {
      const relevantResults = surveyData.results.filter(
        (result: SurveyResult) => result.gender === gender
      );
      const totalScore = relevantResults.reduce(
        (sum, result) =>
          sum +
          satisfactionFields.reduce(
            (fieldSum, field) => fieldSum + parseInt(result[field.key], 10),
            0
          ),
        0
      );
      const totalResponses = relevantResults.length * satisfactionFields.length;
      return {
        gender,
        score: totalResponses > 0 ? totalScore / totalResponses : 0,
      };
    }
  );

  const averageSatisfactionByAgeAllDimensions = satisfactionFields.map(
    (field) => ({
      name: field.name,
      ...ageData.reduce((acc, ageGroup) => {
        const relevantResults = surveyData.results.filter(
          (result: SurveyResult) => result.age === ageGroup.name
        );
        const totalScore = relevantResults.reduce(
          (sum, result) => sum + parseInt(result[field.key], 10),
          0
        );
        const averageScore =
          relevantResults.length > 0 ? totalScore / relevantResults.length : 0;
        return {
          ...acc,
          [ageGroup.name]: averageScore,
        };
      }, {}),
    })
  );

  const averageSatisfactionByGenderAllDimensions = satisfactionFields.map(
    (field) => ({
      name: field.name,
      ...Object.keys(surveyData.gender).reduce((acc, gender) => {
        const relevantResults = surveyData.results.filter(
          (result: SurveyResult) => result.gender === gender
        );
        const totalScore = relevantResults.reduce(
          (sum, result) => sum + parseInt(result[field.key], 10),
          0
        );
        const averageScore =
          relevantResults.length > 0 ? totalScore / relevantResults.length : 0;
        return {
          ...acc,
          [gender]: averageScore,
        };
      }, {}),
    })
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8">Survey Analytics</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Overall Satisfaction</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart
                data={satisfactionData}
                cx="50%"
                cy="50%"
                outerRadius="80%"
              >
                <PolarGrid />
                <PolarAngleAxis dataKey="name" />
                <PolarRadiusAxis angle={30} domain={[0, 7]} />
                <Radar
                  name="Satisfaction"
                  dataKey="score"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.6}
                />
                <Tooltip />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Age Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ageData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
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
                  innerRadius={60}
                  outerRadius={100}
                  fill="#82ca9d"
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
        <Card>
          <CardHeader>
            <CardTitle>User Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Input
                type="text"
                placeholder="Search feedback..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {feedbackData.length > 0 ? (
              <div className="max-h-96 overflow-y-auto">
                {feedbackData.map((entry) => (
                  <div
                    key={entry.id}
                    className={`mb-4 p-4 rounded-lg ${
                      entry.sentiment === "positive"
                        ? "bg-green-100 text-green-800"
                        : entry.sentiment === "negative"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <p>{entry.feedback}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No feedback available.</p>
            )}
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Average Satisfaction by Age Group</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={averageSatisfactionByAge}>
                <XAxis dataKey="age" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="score" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Average Satisfaction by Gender</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={averageSatisfactionByGender}>
                <XAxis dataKey="gender" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="score" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>
              Average Satisfaction by Age Group (All Dimensions)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={averageSatisfactionByAgeAllDimensions}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <XAxis
                  dataKey="name"
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  tickFormatter={(value: string) => value}
                />
                <YAxis />
                <Tooltip />
                <Legend verticalAlign="top" height={36} />
                {ageData.map((ageGroup, index) => (
                  <Bar
                    key={ageGroup.name}
                    dataKey={ageGroup.name}
                    stackId="a"
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>
              Average Satisfaction by Gender (All Dimensions)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={averageSatisfactionByGenderAllDimensions}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <XAxis
                  dataKey="name"
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  tickFormatter={(value: string) => value}
                />
                <YAxis />
                <Tooltip />
                <Legend verticalAlign="top" height={36} />
                {Object.keys(surveyData.gender).map((gender, index) => (
                  <Bar
                    key={gender}
                    dataKey={gender}
                    stackId="a"
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function analyzeSentiment(
  feedback: string
): "positive" | "negative" | "neutral" {
  const positiveWords = ["great", "excellent", "love", "good"];
  const negativeWords = ["bad", "terrible", "hate"];

  const lowercaseFeedback = feedback.toLowerCase();

  if (positiveWords.some((word) => lowercaseFeedback.includes(word))) {
    return "positive";
  } else if (negativeWords.some((word) => lowercaseFeedback.includes(word))) {
    return "negative";
  } else {
    return "neutral";
  }
}
