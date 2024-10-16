"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";  // Importing the Loader icon from Lucide

// Extend Zod schema for URL and chapter validation
const urlSchema = z.object({
    url: z.string().url({ message: "Please enter a valid URL" }),
    startChapter: z.number().min(1, { message: "Starting chapter must be at least 1" }),
    endChapter: z.number().min(1, { message: "Ending chapter must be at least 1" }),
}).superRefine((data, ctx) => {
    if (data.endChapter < data.startChapter) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Ending chapter must be greater than or equal to starting chapter",
            path: ["endChapter"],  // The field where the error will be reported
        });
    }
});

interface UrlFormProps {
    onSubmit: (data: { url: string; startChapter: number; endChapter: number }) => Promise<void>;
}

const UrlForm = ({ onSubmit }: UrlFormProps) => {
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [step, setStep] = useState(1); // Track current step (1 or 2)

    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
    } = useForm({
        resolver: zodResolver(urlSchema),
    });

    const handleFormSubmit = async (data: { url: string; startChapter: number; endChapter: number }) => {
        setLoading(true);
        setErrorMessage(null);

        try {
            await onSubmit(data);  // Call the passed-in onSubmit function
        } catch (error) {
            setErrorMessage("Failed to download the data.");
        } finally {
            setLoading(false);
        }
    };

    // Move to the next step if the URL is valid
    const handleNextStep = () => {
        const url = getValues("url");
        if (!url || errors.url) {
            return; // Don't proceed if there's a URL error
        }
        setStep(2);
    };

    // Move back to the first step
    const handlePreviousStep = () => {
        setStep(1);
    };

    return (
        <div className="flex flex-col items-center w-full max-w-lg mx-auto space-y-8">
            <form onSubmit={handleSubmit(handleFormSubmit)} className="w-full space-y-6">
                {step === 1 && (
                    <>
                        {/* URL input (Step 1) */}
                        <div className="space-y-2">
                            <input
                                type="url"
                                placeholder="Enter a URL"
                                {...register("url")}
                                className={`input input-bordered w-full py-2 px-3 rounded-lg ${
                                    errors.url ? "border-red-500" : "border-gray-300"
                                }`}
                                disabled={loading}
                            />
                            {errors.url && (
                                <p className="text-red-500 text-sm">{errors.url.message}</p>
                            )}
                        </div>

                        {/* Next button */}
                        <button
                            type="button"
                            onClick={handleNextStep}
                            className={`w-full py-2 px-4 rounded-lg text-white bg-blue-600 hover:bg-blue-500 flex justify-center items-center`}
                            disabled={loading}
                        >
                            Next
                        </button>
                    </>
                )}

                {step === 2 && (
                    <>
                        {/* Starting and Ending Chapter inputs (Step 2) */}
                        <div className="space-y-4">
                            <div className="space-y-2">
                                {/* Starting chapter input */}
                                    <input
                                        type="number"
                                        placeholder="Start Chapter"
                                        {...register("startChapter", { valueAsNumber: true })}
                                        className={`input input-bordered w-full py-2 px-3 rounded-lg ${
                                            errors.startChapter ? "border-red-500" : "border-gray-300"
                                        }`}
                                        disabled={loading}
                                    />
                                    {errors.startChapter && (
                                        <p className="text-red-500 text-sm">{errors.startChapter.message}</p>
                                    )}
                            </div>

                            <div className="space-y-2">
                                {/* Ending chapter input */}
                                <input
                                    type="number"
                                    placeholder="End Chapter"
                                    {...register("endChapter", { valueAsNumber: true })}
                                    className={`input input-bordered w-full py-2 px-3 rounded-lg ${
                                        errors.endChapter ? "border-red-500" : "border-gray-300"
                                    }`}
                                    disabled={loading}
                                />
                                {errors.endChapter && (
                                    <p className="text-red-500 text-sm">{errors.endChapter.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Previous and Submit buttons */}
                        <div className="flex space-x-4">
                            <button
                                type="button"
                                onClick={handlePreviousStep}
                                className="w-full py-2 px-4 rounded-lg bg-gray-400 hover:bg-gray-500 text-white flex justify-center items-center"
                            >
                                Back
                            </button>
                            <button
                                type="submit"
                                className={`w-full py-2 px-4 rounded-lg text-white bg-blue-600 hover:bg-blue-500 flex justify-center items-center`}
                                disabled={loading}
                            >
                                {loading ? (
                                    <Loader className="animate-spin h-5 w-5 text-white" />
                                ) : (
                                    "Download"
                                )}
                            </button>
                        </div>
                    </>
                )}
            </form>

            {/* Display error message */}
            {errorMessage && (
                <p className="text-red-500 text-sm font-medium">{errorMessage}</p>
            )}
        </div>
    );
};

export default UrlForm;
