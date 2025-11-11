import { IconTrendingUp, IconTrendingDown } from "@tabler/icons-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
  CardAction,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface StatCardProps {
  description: string;
  title: string | number;
  trend: "up" | "down";
  trendValue: string;
  footerMain: string;
  footerSub: string;
}

export function StatCard({
  description,
  title,
  trend,
  trendValue,
  footerMain,
  footerSub,
}: StatCardProps) {
  const TrendIcon = trend === "up" ? IconTrendingUp : IconTrendingDown;

  return (
    <>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>{description}</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {title}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendIcon />
              {trendValue}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {footerMain} <TrendIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">{footerSub}</div>
        </CardFooter>
      </Card>
    </>
  );
}
