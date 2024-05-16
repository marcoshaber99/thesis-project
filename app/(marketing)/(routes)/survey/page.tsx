// app/(marketing)/(routes)/survey/page.tsx
"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type Gender = "male" | "female" | "other";

export default function SurveyPage() {
  const [responses, setResponses] = useState<{
    attractiveness: string;
    perspicuity: string;
    efficiency: string;
    dependability: string;
    stimulation: string;
    novelty: string;
    feedback: string;
    age: string;
    gender: Gender;
  }>({
    attractiveness: "4",
    perspicuity: "4",
    efficiency: "4",
    dependability: "4",
    stimulation: "4",
    novelty: "4",
    feedback: "",
    age: "30-39",
    gender: "male",
  });

  const submitSurvey = useMutation(api.surveys.submitSurvey);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submitSurvey(responses);
      toast.success("Survey submitted successfully!");
      setResponses({
        attractiveness: "4",
        perspicuity: "4",
        efficiency: "4",
        dependability: "4",
        stimulation: "4",
        novelty: "4",
        feedback: "",
        age: "30-39",
        gender: "male",
      });
    } catch (error) {
      toast.error("Failed to submit survey");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setResponses((prev) => ({ ...prev, [name]: value }));
  };

  const renderLikertScale = (name: keyof typeof responses, label: string) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <div className="mt-2 flex justify-between items-center">
        {["1", "2", "3", "4", "5", "6", "7"].map((value) => (
          <label key={value} className="flex flex-col items-center">
            <input
              type="radio"
              name={name}
              value={value}
              checked={responses[name] === value}
              onChange={handleChange}
              className="form-radio h-5 w-5 text-primary"
            />
            <span className="mt-1 text-sm text-gray-700 dark:text-gray-300">
              {value}
            </span>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-950 p-4 md:p-6">
      <div className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">User Experience Survey</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Help us improve our product by sharing your thoughts and
            experiences.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {renderLikertScale(
            "attractiveness",
            "How attractive do you find our product?"
          )}
          {renderLikertScale(
            "perspicuity",
            "How easy is it to get familiar with our product?"
          )}
          {renderLikertScale(
            "efficiency",
            "How efficient is our product in achieving your goals?"
          )}
          {renderLikertScale(
            "dependability",
            "How dependable do you find our product?"
          )}
          {renderLikertScale(
            "stimulation",
            "How stimulating do you find our product?"
          )}
          {renderLikertScale("novelty", "How innovative is our product?")}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              What do you like or dislike about our product?
            </label>
            <textarea
              name="feedback"
              className="form-textarea mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-800 dark:text-gray-300"
              rows={4}
              value={responses.feedback}
              onChange={handleChange}
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              What is your age?
            </label>
            <select
              name="age"
              className="form-select mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-800 dark:text-gray-300"
              value={responses.age}
              onChange={handleChange}
            >
              <option value="18-24">18-24</option>
              <option value="25-29">25-29</option>
              <option value="30-39">30-39</option>
              <option value="40-49">40-49</option>
              <option value="50+">50+</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              What is your gender?
            </label>
            <div className="mt-2 flex justify-between items-center">
              {(["male", "female", "other"] as const).map((value) => (
                <label key={value} className="flex flex-col items-center">
                  <input
                    type="radio"
                    name="gender"
                    value={value}
                    checked={responses.gender === value}
                    onChange={handleChange}
                    className="form-radio h-5 w-5 text-primary"
                  />
                  <span className="mt-1 text-sm text-gray-700 dark:text-gray-300 capitalize">
                    {value}
                  </span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit">Submit Survey</Button>
          </div>
        </form>
      </div>
    </main>
  );
}
