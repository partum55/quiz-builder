import { ArrowLeft } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";
import { PageContainer } from "@/components/layout/PageContainer";
import { SiteHeader } from "@/components/layout/SiteHeader";
import Skeleton from "@/components/ui/Skeleton";

export default function QuizDetailLoading() {
  return (
    <>
      <SiteHeader
        action={
          <LinkButton href="/quizzes" variant="ghost" icon={<ArrowLeft />}>
            Back to quizzes
          </LinkButton>
        }
      />
      <PageContainer>
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="mt-3 h-4 w-40" />
        <div className="mt-8 flex flex-col gap-6">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      </PageContainer>
    </>
  );
}
