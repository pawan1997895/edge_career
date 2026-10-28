import type { Metadata } from "next";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { getCompanyFocusOptions, getInterviewQuota } from "@/data/interviews";
import { getCurrentUser } from "@/data/user";
import { InterviewSetupForm } from "@/features/interviews/components/setup/interview-setup-form";
import { routes } from "@/lib/routes";
import type { InterviewType } from "@/types/interviews";

export const metadata: Metadata = { title: "New mock interview" };

const TYPES: InterviewType[] = ["dsa", "lld", "hld", "behavioral"];

export default async function InterviewSetupPage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const { type } = await searchParams;
  const initialType = TYPES.includes(type as InterviewType) ? (type as InterviewType) : "dsa";
  const [quota, user, companyOptions] = await Promise.all([getInterviewQuota(), getCurrentUser(), getCompanyFocusOptions()]);

  return (
    <PageContainer>
      <PageHeader
        breadcrumbs={[{ label: "Mock interviews", href: routes.interviews }, { label: "New interview" }]}
        title="Set up your interview"
        description="Pick the round you want to practise. You can end early at any time; you're charged only for live minutes."
      />
      <InterviewSetupForm
        key={initialType}
        initialType={initialType}
        quota={quota}
        targetCompanies={user.targetCompanies}
        companyOptions={companyOptions}
      />
    </PageContainer>
  );
}
