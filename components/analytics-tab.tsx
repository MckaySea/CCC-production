"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
  ResponsiveContainer,
} from "recharts";
import { Eye, Users, TrendingUp, RefreshCw } from "lucide-react";

interface AnalyticsData {
  dailyData: Array<{ date: string; views: number; visitors: number }>;
  topPages: Array<{ path: string; views: number }>;
  summary: {
    totalViews: number;
    uniqueVisitors: number;
    avgViewsPerDay: number;
    days: number;
  };
}

const chartConfig = {
  views: {
    label: "Page Views",
    color: "hsl(142, 76%, 36%)", // emerald-600
  },
  visitors: {
    label: "Visitors",
    color: "hsl(217, 91%, 60%)", // blue-500
  },
};

export function AnalyticsTab() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [days, setDays] = useState(30);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/analytics?days=${days}`);
      if (!response.ok) {
        throw new Error("Failed to fetch analytics");
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [days]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="pt-6">
          <p className="text-destructive text-center">{error}</p>
          <Button onClick={fetchAnalytics} className="mt-4 mx-auto block">
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const formatPath = (path: string) => {
    if (path === "/") return "Home";
    return path.replace(/^\//, "").replace(/-/g, " ").slice(0, 20) + (path.length > 20 ? "..." : "");
  };

  return (
    <div className="space-y-6">
      {/* Date Range Selector */}
      <div className="flex gap-2 flex-wrap">
        {[7, 30, 90].map((d) => (
          <Button
            key={d}
            variant={days === d ? "default" : "outline"}
            size="sm"
            onClick={() => setDays(d)}
          >
            {d} Days
          </Button>
        ))}
        <Button
          variant="ghost"
          size="sm"
          onClick={fetchAnalytics}
          className="ml-auto"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-500/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Page Views</CardTitle>
              <Eye className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-500">
                {data?.summary.totalViews.toLocaleString() || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Last {days} days
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-500">
                {data?.summary.uniqueVisitors.toLocaleString() || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Last {days} days
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Avg Views/Day</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-500">
                {data?.summary.avgViewsPerDay.toLocaleString() || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Daily average
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Page Views Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Page Views Over Time</CardTitle>
            <CardDescription>
              Daily page views and unique visitors
            </CardDescription>
          </CardHeader>
          <CardContent>
            {data?.dailyData && data.dailyData.length > 0 ? (
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <LineChart data={data.dailyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatDate}
                    className="text-xs"
                  />
                  <YAxis className="text-xs" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="views"
                    stroke="var(--color-views)"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="visitors"
                    stroke="var(--color-visitors)"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ChartContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                No data available for this period
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Top Pages */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Top Pages</CardTitle>
            <CardDescription>
              Most visited pages in the last {days} days
            </CardDescription>
          </CardHeader>
          <CardContent>
            {data?.topPages && data.topPages.length > 0 ? (
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <BarChart data={data.topPages} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis type="number" className="text-xs" />
                  <YAxis
                    dataKey="path"
                    type="category"
                    tickFormatter={formatPath}
                    className="text-xs"
                    width={100}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="views"
                    fill="var(--color-views)"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ChartContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                No data available for this period
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
