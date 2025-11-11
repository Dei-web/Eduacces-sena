import { SiteHeader } from "@/components/header-dash";
import { TestReport } from "@/components/reports-component-two";

export default function reportsHome() {
  // const stats = [
  //   {
  //     description: "Total Revenue",
  //     title: "$1,250.00",
  //     trend: "up",
  //     trendValue: "+12.5%",
  //     footerMain: "Trending up this month",
  //     footerSub: "Visitors for the last 6 months",
  //   },
  //   {
  //     description: "New Customers",
  //     title: 1234,
  //     trend: "down",
  //     trendValue: "-20%",
  //     footerMain: "Down 20% this period",
  //     footerSub: "Acquisition needs attention",
  //   },
  //   {
  //     description: "Active Accounts",
  //     title: 45678,
  //     trend: "up",
  //     trendValue: "+12.5%",
  //     footerMain: "Strong user retention",
  //     footerSub: "Engagement exceed targets",
  //   },
  //   {
  //     description: "Growth Rate",
  //     title: "4.5%",
  //     trend: "up",
  //     trendValue: "+4.5%",
  //     footerMain: "Steady performance increase",
  //     footerSub: "Meets growth projections",
  //   },
  // ];

  return (
    <>
      <div className="flex flex-1 flex-col">
        <SiteHeader title="Header-reports" />
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-2">
              {/* {stats.map((stat, idx) => ( */}
              {/*   <StatCard key={idx} {...stat} /> */}
              {/* ))} */}
            </div>
            <div className="px-4 lg:px-6">
              <TestReport />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
