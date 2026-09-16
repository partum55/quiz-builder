import { Plus } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";
import { PageContainer } from "@/components/layout/PageContainer";
import { SiteHeader } from "@/components/layout/SiteHeader";
import Card from "@/components/ui/Card";
import Skeleton from "@/components/ui/Skeleton";

export default function QuizzesLoading() {
  return (
    <>
      <SiteHeader
        action={
          <LinkButton href="/create" icon={<Plus />}>
            New quiz
          </LinkButton>
        }
      />
      <PageContainer>
        <h1 className="font-serif text-2xl text-ink">Your quizzes</h1>
        <Skeleton className="mt-2 h-4 w-20" />
        <Card className="mt-6 overflow-hidden p-0">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center gap-4 border-t border-border px-5 py-4 first:border-t-0"
            >
              <Skeleton className="h-9 w-9 shrink-0 rounded-md" />
              <div className="min-w-0 flex-1">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="mt-2 h-4 w-1/3" />
              </div>
            </div>
          ))}
        </Card>
      </PageContainer>
    </>
  );
}
