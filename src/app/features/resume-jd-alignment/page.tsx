import type { Metadata } from "next";
import ResumeJdAlignmentContent from "./ResumeJdAlignmentContent";

export const metadata: Metadata = {
  title: "Resume & JD Alignment AI Interview Helper | CrackTheLoop",
  description:
    "Align your interview talking points directly to the job description and your resume. Extract mandatory keywords and relevant metrics dynamically using semantic AI models.",
  keywords: [
    "resume jd alignment AI",
    "interview keyword matcher",
    "STAR answer structuring",
    "personalized talking points",
    "interview copilot",
  ],
};

export default function ResumeJdAlignmentPage() {
  return <ResumeJdAlignmentContent />;
}
