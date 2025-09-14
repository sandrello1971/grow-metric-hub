import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: number;
  previousValue?: number;
  format?: "currency" | "percentage";
  icon?: ReactNode;
  target?: number;
  className?: string;
}

export function MetricCard({ 
  title, 
  value, 
  previousValue, 
  format = "currency",
  icon,
  target,
  className 
}: MetricCardProps) {
  const formatValue = (val: number) => {
    if (format === "currency") {
      return new Intl.NumberFormat("it-IT", {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(val);
    }
    if (format === "percentage") {
      return `${val.toFixed(1)}%`;
    }
    return val.toString();
  };

  const getTrend = () => {
    if (previousValue === undefined) return null;
    
    const change = ((value - previousValue) / previousValue) * 100;
    if (Math.abs(change) < 0.1) return { type: "neutral", value: change };
    return { 
      type: change > 0 ? "positive" : "negative", 
      value: change 
    };
  };

  const isUnderTarget = target !== undefined && value < target;
  const trend = getTrend();

  return (
    <Card className={cn(
      "bg-gradient-card shadow-card hover:shadow-card-hover transition-all duration-300",
      isUnderTarget && "border-warning/50",
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon && (
          <div className="text-muted-foreground">
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-foreground">
            {formatValue(value)}
          </div>
          
          {trend && (
            <div className={cn(
              "flex items-center space-x-1 text-sm",
              trend.type === "positive" && "text-success",
              trend.type === "negative" && "text-danger",
              trend.type === "neutral" && "text-muted-foreground"
            )}>
              {trend.type === "positive" && <TrendingUp className="w-4 h-4" />}
              {trend.type === "negative" && <TrendingDown className="w-4 h-4" />}
              {trend.type === "neutral" && <Minus className="w-4 h-4" />}
              <span>{Math.abs(trend.value).toFixed(1)}%</span>
            </div>
          )}
        </div>
        
        {isUnderTarget && (
          <div className="mt-2">
            <Badge variant="outline" className="text-warning border-warning/50">
              Sotto target: {formatValue(target!)}
            </Badge>
          </div>
        )}
        
        {target && !isUnderTarget && (
          <p className="text-xs text-muted-foreground mt-2">
            Target: {formatValue(target)}
          </p>
        )}
      </CardContent>
    </Card>
  );
}