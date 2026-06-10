import mongoose, { Schema, Document, Model } from "mongoose";

export interface IEducation {
  school: string;
  degree: string;
  field_of_study: string;
  start_date: string;
  end_date: string;
  description: string;
}

export interface IExperience {
  company: string;
  position: string;
  location: string;
  start_date: string;
  end_date: string;
  description: string;
}

export interface IProject {
  title: string;
  description: string;
  technologies: string[];
}

export interface IPersonalDetails {
  name: string;
  email: string;
  phone: string;
  location: string;
}

export interface IResume extends Document {
  user_id: mongoose.Types.ObjectId;
  title: string;
  personal_details: IPersonalDetails;
  summary: string;
  education: IEducation[];
  experience: IExperience[];
  skills: string[];
  projects: IProject[];
  created_at: Date;
  updated_at: Date;
}

const PersonalDetailsSchema = new Schema<IPersonalDetails>(
  {
    name: { type: String, default: "" },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    location: { type: String, default: "" },
  },
  { _id: false }
);

const EducationSchema = new Schema<IEducation>(
  {
    school: { type: String, default: "" },
    degree: { type: String, default: "" },
    field_of_study: { type: String, default: "" },
    start_date: { type: String, default: "" },
    end_date: { type: String, default: "" },
    description: { type: String, default: "" },
  },
  { _id: false }
);

const ExperienceSchema = new Schema<IExperience>(
  {
    company: { type: String, default: "" },
    position: { type: String, default: "" },
    location: { type: String, default: "" },
    start_date: { type: String, default: "" },
    end_date: { type: String, default: "" },
    description: { type: String, default: "" },
  },
  { _id: false }
);

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    technologies: { type: [String], default: [] },
  },
  { _id: false }
);

const ResumeSchema = new Schema<IResume>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    personal_details: {
      type: PersonalDetailsSchema,
      default: () => ({}),
    },
    summary: {
      type: String,
      default: "",
    },
    education: {
      type: [EducationSchema],
      default: [],
    },
    experience: {
      type: [ExperienceSchema],
      default: [],
    },
    skills: {
      type: [String],
      default: [],
    },
    projects: {
      type: [ProjectSchema],
      default: [],
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
    versionKey: false,
  }
);

if (mongoose.models.Resume) {
  delete (mongoose.models as any).Resume;
}

export const Resume: Model<IResume> =
  mongoose.models.Resume || mongoose.model<IResume>("Resume", ResumeSchema);
